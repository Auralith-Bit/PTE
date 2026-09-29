"""Regression tests for the audit-backlog fixes.

Each test pins a behaviour that was previously wrong, so a later change cannot
silently reintroduce it.
"""
from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy import select

from app.core.security import hash_password
from app.models.attempt import Attempt
from app.models.password_reset_token import PasswordResetToken
from app.models.question import Question
from app.models.user import User
from app.schemas.practice import QuestionOut
from app.schemas.user import ChangePassword, ResetPasswordRequest, UserRegister
from app.services import dashboard_service, password_reset


# --------------------------------------------------------------------------
# Grading references must not be shipped to the client
# --------------------------------------------------------------------------
def test_notes_is_not_exposed_on_question_out():
    """`notes` is the speaking model answer; it used to reach the browser."""
    q = Question(
        id=1,
        category="speaking",
        type="read-aloud",
        title="t",
        instructions="i",
        difficulty="medium",
        content={
            "prompt": "Read the text",
            "notes": "the model answer",
            "transcript": "listening material",
            "correct": "C",
        },
        created_at=datetime.now(UTC),
    )
    content = QuestionOut.from_question(q).content
    assert "notes" not in content
    assert content["prompt"] == "Read the text"


def test_transcript_is_kept_because_the_listening_ui_renders_it():
    """TaskScaffold shows content.transcript as the "Audio / Transcript" block."""
    q = Question(
        id=2,
        category="listening",
        type="summarize-spoken-test",
        title="t",
        instructions="i",
        difficulty="medium",
        content={"transcript": "the spoken passage"},
        created_at=datetime.now(UTC),
    )
    assert QuestionOut.from_question(q).content["transcript"] == "the spoken passage"


def test_seeded_questions_do_not_leak_answers_over_the_api(client):
    for path in (
        "/api/v1/speaking/questions",
        "/api/v1/writing/questions",
        "/api/v1/listening/questions",
        "/api/v1/reading/questions",
    ):
        r = client.get(path, params={"limit": 100})
        assert r.status_code == 200, path
        # `notes` as a JSON key would show up even when its text is prose.
        assert '"notes"' not in r.text, f"model answer leaked from {path}"


# --------------------------------------------------------------------------
# Passwords over bcrypt's 72-byte limit were a 500
# --------------------------------------------------------------------------
@pytest.mark.parametrize("n", [73, 100, 200])
def test_register_rejects_password_over_72_bytes(n):
    with pytest.raises(ValueError):
        UserRegister(email="a@b.com", password="x" * n)


def test_password_limit_is_measured_in_bytes_not_characters():
    """A 24-character 3-byte password is 72 bytes and must still be allowed."""
    UserRegister(email="a@b.com", password="€" * 24)
    with pytest.raises(ValueError):
        UserRegister(email="a@b.com", password="€" * 25)


def test_change_and_reset_password_reject_oversized_input():
    with pytest.raises(ValueError):
        ChangePassword(new_password="x" * 100)
    with pytest.raises(ValueError):
        ResetPasswordRequest(token="t" * 25, new_password="x" * 100)


# --------------------------------------------------------------------------
# Dashboard progress could exceed 100% when a question was retried
# --------------------------------------------------------------------------
def _completed_attempt(user_id, question_id, category, when=None, question_type="essay"):
    return Attempt(
        user_id=user_id,
        question_id=question_id,
        category=category,
        question_type=question_type,
        status="completed",
        score=5,
        answer={},
        created_at=when or datetime.now(UTC),
    )


@pytest.fixture
def user_with_questions(db_session):
    user = User(email="dash@example.com", password_hash=hash_password("password123"))
    db_session.add(user)
    db_session.flush()
    questions = [
        Question(category="speaking", type="read-aloud", difficulty="medium", content={}),
        Question(category="writing", type="essay", difficulty="medium", content={}),
    ]
    db_session.add_all(questions)
    db_session.commit()
    yield user, questions
    db_session.query(Attempt).filter(Attempt.user_id == user.id).delete()
    db_session.query(Question).filter(Question.id.in_([q.id for q in questions])).delete()
    db_session.delete(user)
    db_session.commit()


def test_section_pct_clamps_to_100():
    """Even with an inflated count the rendered percentage must not exceed 100."""
    assert dashboard_service._section_pct(200, 1) == 100
    assert dashboard_service._section_pct(1, 1) == 100
    assert dashboard_service._section_pct(1, 2) == 50
    assert dashboard_service._section_pct(0, 0) == 0


def test_retrying_one_question_does_not_push_progress_over_100(db_session, user_with_questions):
    user, (speaking_q, _writing_q) = user_with_questions

    # Five completed attempts at the SAME speaking question.
    for _ in range(5):
        db_session.add(
            _completed_attempt(user.id, speaking_q.id, "speaking",
                               when=datetime.now(UTC) - timedelta(days=1))
        )
    db_session.commit()

    summary = dashboard_service.compute_dashboard_summary(db_session, user.id)

    assert summary["speaking_pct"] <= 100, "retries inflated section progress"
    assert summary["practice_completed_pct"] <= 100, "retries inflated overall progress"
    # One distinct question of the seeded bank, not five.
    assert summary["speaking_pct"] < 100


def test_distinct_questions_are_counted_once(db_session, user_with_questions):
    user, (speaking_q, _writing_q) = user_with_questions
    for _ in range(3):
        db_session.add(_completed_attempt(user.id, speaking_q.id, "speaking"))
    db_session.commit()

    total_by_cat, done_by_cat = dashboard_service._count_by_category(db_session, user.id)
    assert done_by_cat["speaking"] == 1, "retries were counted as extra progress"
    assert done_by_cat["speaking"] <= total_by_cat["speaking"]


# --------------------------------------------------------------------------
# Streak used to read 0 until the user practised on the current day
# --------------------------------------------------------------------------
def test_streak_survives_a_day_that_has_not_been_practised_yet(db_session, user_with_questions):
    """Practised yesterday, not yet today: the streak must not read 0."""
    user, (speaking_q, _) = user_with_questions
    yesterday = datetime.now(UTC) - timedelta(days=1)
    db_session.add(_completed_attempt(user.id, speaking_q.id, "speaking", when=yesterday))
    db_session.commit()

    summary = dashboard_service.compute_dashboard_summary(db_session, user.id)
    assert summary["streak_days"] == 1


def test_streak_counts_consecutive_days(db_session, user_with_questions):
    user, (speaking_q, _) = user_with_questions
    now = datetime.now(UTC)
    for offset in range(3):
        db_session.add(
            _completed_attempt(user.id, speaking_q.id, "speaking", when=now - timedelta(days=offset))
        )
    db_session.commit()

    assert dashboard_service.compute_dashboard_summary(db_session, user.id)["streak_days"] == 3


def test_streak_breaks_on_a_missed_day(db_session, user_with_questions):
    user, (speaking_q, _) = user_with_questions
    now = datetime.now(UTC)
    for offset in (0, 2, 3):
        db_session.add(
            _completed_attempt(user.id, speaking_q.id, "speaking", when=now - timedelta(days=offset))
        )
    db_session.commit()

    assert dashboard_service.compute_dashboard_summary(db_session, user.id)["streak_days"] == 1


def test_streak_is_zero_after_two_idle_days(db_session, user_with_questions):
    user, (speaking_q, _) = user_with_questions
    db_session.add(
        _completed_attempt(user.id, speaking_q.id, "speaking",
                           when=datetime.now(UTC) - timedelta(days=2))
    )
    db_session.commit()

    assert dashboard_service.compute_dashboard_summary(db_session, user.id)["streak_days"] == 0


# --------------------------------------------------------------------------
# Two concurrent redemptions of one reset link
# --------------------------------------------------------------------------
@pytest.fixture
def reset_user(db_session):
    user = User(email="reset-race@example.com", password_hash=hash_password("password123"))
    db_session.add(user)
    db_session.commit()
    yield user
    db_session.query(PasswordResetToken).filter(PasswordResetToken.user_id == user.id).delete()
    db_session.delete(user)
    db_session.commit()


def test_a_reset_token_cannot_be_redeemed_twice(db_session, reset_user):
    """The second redemption must fail rather than overwrite the password."""
    now = datetime.now(UTC)
    record = PasswordResetToken(
        user_id=reset_user.id,
        token_hash=password_reset.hash_token("a" * 40),
        expires_at=now + timedelta(hours=1),
    )
    db_session.add(record)
    db_session.commit()

    password_reset.complete_reset(db_session, "a" * 40, "FirstNewPassword1")
    with pytest.raises(ValueError):
        password_reset.complete_reset(db_session, "a" * 40, "SecondNewPassword2")

    db_session.expire_all()
    stored = db_session.scalars(select(User).where(User.id == reset_user.id)).one()
    from app.core.security import verify_password

    assert verify_password("FirstNewPassword1", stored.password_hash), "first password was overwritten"
    assert not verify_password("SecondNewPassword2", stored.password_hash)
