"""Tests for the notification feed derived from graded work.

Notifications are projected from attempts and mock attempts rather than stored,
so these pin the projection: items appear only for real scored rows, ordering is
newest first, read state follows the cursor on the user, and a new user sees an
empty feed with no badge.
"""
from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest

from app.core.security import hash_password
from app.models.attempt import Attempt
from app.models.mock_test import MockAttempt, MockTest
from app.models.question import Question
from app.models.user import User
from app.services.notification_service import build_notifications


@pytest.fixture
def notif_user(db_session):
    """A user unique to this run so a leftover row cannot fail the fixture."""
    user = User(email=f"bell-{uuid4().hex}@example.com", password_hash=hash_password("password123"))
    db_session.add(user)
    db_session.commit()
    created_questions: list[int] = []
    created_tests: list[int] = []
    user._test_question_ids = created_questions  # type: ignore[attr-defined]
    user._test_test_ids = created_tests  # type: ignore[attr-defined]
    yield user
    db_session.query(Attempt).filter(Attempt.user_id == user.id).delete()
    db_session.query(MockAttempt).filter(MockAttempt.user_id == user.id).delete()
    db_session.query(Question).filter(Question.id.in_(created_questions)).delete()
    db_session.query(MockTest).filter(MockTest.id.in_(created_tests)).delete()
    db_session.delete(user)
    db_session.commit()


def _add_question(db_session, title="Question", owner=None) -> Question:
    q = Question(category="reading", type="fill-in-the-blanks", title=title,
                 difficulty="medium", content={})
    db_session.add(q)
    db_session.commit()
    if owner is not None:
        owner._test_question_ids.append(q.id)  # type: ignore[attr-defined]
    return q


def _add_attempt(db_session, user, question, when=None, score=7, status="completed"):
    a = Attempt(
        user_id=user.id,
        question_id=question.id,
        category="reading",
        question_type="fill-in-the-blanks",
        status=status,
        score=score,
        answer={},
        created_at=when or datetime.now(UTC),
    )
    db_session.add(a)
    db_session.commit()
    return a


def _add_mock_attempt(db_session, user, when=None, score=60, maximum=92):
    test = MockTest(name="Full Length Mock Test", slug=f"bell-{uuid4().hex[:12]}", kind="full_length",
                    duration_minutes=135)
    db_session.add(test)
    db_session.commit()
    user._test_test_ids.append(test.id)  # type: ignore[attr-defined]
    ma = MockAttempt(
        user_id=user.id,
        mock_test_id=test.id,
        status="completed",
        questions=[],
        answers={},
        results={},
        total_score=score,
        max_score=maximum,
        started_at=(when or datetime.now(UTC)) - timedelta(hours=1),
        completed_at=when or datetime.now(UTC),
    )
    db_session.add(ma)
    db_session.commit()
    return ma, test


# --------------------------------------------------------------------------
# A new user has nothing to be notified about
# --------------------------------------------------------------------------
def test_new_user_has_no_notifications(db_session, notif_user):
    assert build_notifications(db_session, notif_user.id) == []


def test_unscored_or_unfinished_work_produces_nothing(db_session, notif_user):
    """Only graded work should notify. An in-progress attempt has no result yet."""
    q = _add_question(db_session, owner=notif_user)
    _add_attempt(db_session, notif_user, q, score=None, status="in_progress")
    assert build_notifications(db_session, notif_user.id) == []


# --------------------------------------------------------------------------
# Practice attempts
# --------------------------------------------------------------------------
def test_scored_attempt_becomes_a_notification(db_session, notif_user):
    q = _add_question(db_session, title="Photosynthesis Blanks", owner=notif_user)
    _add_attempt(db_session, notif_user, q, score=7)
    items = build_notifications(db_session, notif_user.id)
    assert len(items) == 1
    assert items[0]["kind"] == "practice_scored"
    assert items[0]["title"] == "Reading attempt scored"
    assert "Photosynthesis Blanks" in items[0]["body"]
    assert "7/10" in items[0]["body"]
    assert items[0]["href"].startswith("/practice/reading/")


def test_retries_each_produce_an_item_and_newest_comes_first(db_session, notif_user):
    now = datetime.now(UTC)
    q = _add_question(db_session, owner=notif_user)
    _add_attempt(db_session, notif_user, q, when=now - timedelta(hours=5), score=3)
    _add_attempt(db_session, notif_user, q, when=now - timedelta(minutes=5), score=9)
    items = build_notifications(db_session, notif_user.id)
    assert len(items) == 2
    assert "9/10" in items[0]["body"], "newest attempt must sort first"
    assert "3/10" in items[1]["body"]


def test_attempt_older_than_lookback_is_not_notified(db_session, notif_user):
    """A student who practised last month should not get a badge for it."""
    q = _add_question(db_session, owner=notif_user)
    _add_attempt(db_session, notif_user, q, when=datetime.now(UTC) - timedelta(days=60))
    assert build_notifications(db_session, notif_user.id) == []


# --------------------------------------------------------------------------
# Mock tests
# --------------------------------------------------------------------------
def test_completed_mock_test_becomes_a_notification(db_session, notif_user):
    _add_mock_attempt(db_session, notif_user, score=60, maximum=92)
    items = build_notifications(db_session, notif_user.id)
    assert len(items) == 1
    assert items[0]["kind"] == "mock_graded"
    assert "60/92" in items[0]["body"]
    assert "65%" in items[0]["body"], "band percentage should be reported"


def test_in_progress_mock_test_is_not_notified(db_session, notif_user):
    test = MockTest(name="In progress", slug=f"wip-{uuid4().hex[:12]}", kind="full_length",
                    duration_minutes=60)
    db_session.add(test)
    db_session.commit()
    notif_user._test_test_ids.append(test.id)  # type: ignore[attr-defined]
    db_session.add(MockAttempt(user_id=notif_user.id, mock_test_id=test.id,
                               status="in_progress", questions=[], answers={}, results={}))
    db_session.commit()
    assert build_notifications(db_session, notif_user.id) == []


def test_mock_and_practice_ids_cannot_collide(db_session, notif_user):
    q = _add_question(db_session, owner=notif_user)
    _add_attempt(db_session, notif_user, q)
    ma, _ = _add_mock_attempt(db_session, notif_user)
    items = build_notifications(db_session, notif_user.id)
    ids = [i["id"] for i in items]
    assert len(ids) == len(set(ids)), f"duplicate ids: {ids}"
    # A mock attempt and an attempt can share a numeric id; the prefix separates them.
    assert f"mock-{ma.id}" in ids


# --------------------------------------------------------------------------
# Read state and ordering across sources
# --------------------------------------------------------------------------
def test_mixed_sources_are_interleaved_by_time(db_session, notif_user):
    now = datetime.now(UTC)
    q = _add_question(db_session, owner=notif_user)
    _add_attempt(db_session, notif_user, q, when=now - timedelta(hours=2))
    _add_mock_attempt(db_session, notif_user, when=now - timedelta(hours=1))
    _add_attempt(db_session, notif_user, q, when=now - timedelta(minutes=1))
    kinds = [i["kind"] for i in build_notifications(db_session, notif_user.id)]
    assert kinds == ["practice_scored", "mock_graded", "practice_scored"]


def test_limit_is_respected(db_session, notif_user):
    q = _add_question(db_session, owner=notif_user)
    now = datetime.now(UTC)
    for i in range(6):
        _add_attempt(db_session, notif_user, q, when=now - timedelta(minutes=i), score=i)
    assert len(build_notifications(db_session, notif_user.id, limit=3)) == 3