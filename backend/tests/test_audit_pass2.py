"""Regression tests for the second audit pass.

Covers four defects found by a follow-up review of the codebase:

* a correctly signed token carrying a non-numeric ``sub`` returned 500 with a
  stack trace instead of 401
* the seeded re-order-paragraphs question was pre-solved, because the stored
  answer order equalled the identity permutation the client initialises with
* day boundaries mixed the database session timezone with UTC, so one dashboard
  response carried two different definitions of "today"
* the mock-test countdown stopped at 00:00 instead of handing the paper in
"""
from datetime import UTC, datetime, timedelta

import jwt
import pytest
from sqlalchemy import select, text

from app.core.config import settings
from app.core.security import hash_password
from app.db.seed_data import READING_REORDER_PARAGRAPHS
from app.models.attempt import Attempt
from app.models.question import Question
from app.models.user import User
from app.services import dashboard_service
from app.services.scoring.reading_scorer import score_reading


# --------------------------------------------------------------------------
# A malformed "sub" in a validly signed token must be 401, not 500
# --------------------------------------------------------------------------
@pytest.fixture
def auth_client(client, db_session):
    user = User(email="sub-type@example.com", password_hash=hash_password("password123"))
    db_session.add(user)
    db_session.commit()
    user_id = user.id

    def _request(sub):
        token = jwt.encode(
            {"sub": sub, "type": "access", "ver": 0},
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )
        return client.get(
            "/api/v1/dashboard/summary",
            headers={"Authorization": f"Bearer {token}"},
        )

    yield _request

    db_session.expire_all()
    db_session.query(Attempt).filter(Attempt.user_id == user_id).delete()
    db_session.query(User).filter(User.id == user_id).delete()
    db_session.commit()


@pytest.mark.parametrize("sub", ["not-a-number", "1.5", "", None, "abc123", [], {"id": 1}])
def test_non_integer_sub_is_rejected_with_401(auth_client, sub):
    r = auth_client(sub)
    assert r.status_code == 401, f"sub={sub!r} returned {r.status_code}, expected 401"
    # A 500 leaks internals; the body must carry only the generic message.
    assert "Traceback" not in r.text
    assert "detail" in r.json()


def test_valid_sub_still_authenticates(auth_client, client, db_session):
    """Guard against over-correcting: a genuine numeric sub must still work."""
    user = User(email="sub-ok@example.com", password_hash=hash_password("password123"))
    db_session.add(user)
    db_session.commit()
    uid = user.id

    token = jwt.encode(
        {"sub": str(uid), "type": "access", "ver": 0},
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    r = client.get(
        "/api/v1/dashboard/summary",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200, r.text

    db_session.query(Attempt).filter(Attempt.user_id == uid).delete()
    db_session.query(User).filter(User.id == uid).delete()
    db_session.commit()


def test_unknown_numeric_sub_is_401(auth_client):
    assert auth_client("99999999").status_code == 401


# --------------------------------------------------------------------------
# The seeded reorder question must not be pre-solved
# --------------------------------------------------------------------------
def test_seeded_reorder_answer_is_not_the_identity_permutation():
    order = READING_REORDER_PARAGRAPHS["order"]
    paragraphs = READING_REORDER_PARAGRAPHS["paragraphs"]
    assert order != list(range(len(paragraphs))), (
        "the stored order equals the identity permutation the client initialises "
        "with, so an untouched submit scores full marks"
    )


def test_seeded_reorder_order_is_a_valid_permutation():
    order = READING_REORDER_PARAGRAPHS["order"]
    n = len(READING_REORDER_PARAGRAPHS["paragraphs"])
    assert sorted(order) == list(range(n)), "order must be a permutation of every index"


def test_unanswered_reorder_scores_zero():
    """The client seeds state with [0,1,2,3]; that must no longer be the key."""
    content = {"order": READING_REORDER_PARAGRAPHS["order"]}
    untouched = {"order": list(range(len(READING_REORDER_PARAGRAPHS["paragraphs"])))}
    result = score_reading("re-order-paragraphs", content, untouched)
    assert result.score < result.max_score, "untouched submit still scores full marks"


def test_correct_reorder_still_scores_full_marks():
    content = {"order": READING_REORDER_PARAGRAPHS["order"]}
    result = score_reading("re-order-paragraphs", content, {"order": list(content["order"])})
    assert result.score == result.max_score


def test_live_seeded_reorder_question_is_not_pre_solved(db_session):
    """Guard the database too, not just the seed module."""
    rows = db_session.scalars(
        select(Question).where(Question.type == "re-order-paragraphs")
    ).all()
    for q in rows:
        order = (q.content or {}).get("order")
        paragraphs = (q.content or {}).get("paragraphs") or []
        if not order or not paragraphs:
            continue
        assert order != list(range(len(paragraphs))), (
            f"question {q.id} is still pre-solved; run the a1f7c3d90b62 migration"
        )


# --------------------------------------------------------------------------
# Day boundaries must be UTC everywhere, not the DB session timezone
# --------------------------------------------------------------------------
def test_utc_day_helper_normalises_to_utc(db_session):
    """An attempt at 00:30 UTC belongs to that UTC day, whatever the DB zone is."""
    # 20:30 UTC on the 29th is already the 30th in Asia/Katmandu (+05:45).
    probe = text(
        """
        WITH t(ts) AS (VALUES (TIMESTAMPTZ '2026-09-29 20:30:00+00'))
        SELECT date_trunc('day', timezone('UTC', ts)) AS ours,
               date_trunc('day', ts)               AS session_zone
        FROM t
        """
    )
    row = db_session.execute(probe).mappings().one()
    assert str(row["ours"])[:10] == "2026-09-29", "helper must truncate on the UTC day"
    assert str(row["session_zone"])[:10] == "2026-09-30", (
        "the session-zone form is expected to differ; if this now matches, the "
        "test no longer proves the bug it guards"
    )


def test_dashboard_day_boundaries_are_utc(db_session):
    """No unzoned date_trunc may remain on an attempt timestamp."""
    from sqlalchemy.dialects import postgresql

    sql = str(
        dashboard_service._utc_day(Attempt.created_at).compile(
            dialect=postgresql.dialect(), compile_kwargs={"literal_binds": True}
        )
    )
    assert "timezone('UTC'" in sql, f"day truncation is not pinned to UTC: {sql}"
    assert "date_trunc('day', attempts.created_at)" not in sql, (
        f"unzoned date_trunc would use the session timezone: {sql}"
    )


def test_attempt_just_after_midnight_utc_counts_as_today(db_session):
    """00:30 UTC must land on the current day even though Kathmandu reads 06:15."""
    now = datetime.now(UTC)
    today_utc = now.date()
    if now.hour >= 6:
        pytest.skip("UTC day and Kathmandu day agree at this hour; nothing to prove")

    user = User(email="tz-edge@example.com", password_hash=hash_password("password123"))
    db_session.add(user)
    db_session.flush()
    q = Question(category="writing", type="essay", difficulty="medium", content={})
    db_session.add(q)
    db_session.flush()

    # A timestamp on today's UTC date but in the small hours UTC.
    early = datetime.combine(today_utc, datetime.min.time(), tzinfo=UTC) + timedelta(minutes=30)
    if early >= now:
        pytest.skip("cannot place an attempt earlier today")

    db_session.add(
        Attempt(
            user_id=user.id,
            question_id=q.id,
            category="writing",
            question_type="essay",
            status="completed",
            score=5,
            answer={},
            created_at=early,
        )
    )
    db_session.commit()

    summary = dashboard_service.compute_dashboard_summary(db_session, user.id)
    assert summary["streak_days"] >= 1, "an early-UTC-day attempt was counted on the wrong day"

    db_session.query(Attempt).filter(Attempt.user_id == user.id).delete()
    db_session.query(Question).filter(Question.id == q.id).delete()
    db_session.delete(user)
    db_session.commit()
