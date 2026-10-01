"""API-level tests for the notification endpoints.

Covers the read cursor: unread_count must reflect real unread items, opening the
feed must advance the cursor, and a fresh cursor must leave everything unread.
Also pins that the endpoints require authentication rather than leaking
another user's feed.
"""
from datetime import UTC, datetime, timedelta
from uuid import uuid4

import pytest

from app.core.security import hash_password
from app.models.attempt import Attempt
from app.models.question import Question
from app.models.user import User


@pytest.fixture
def bell_user(client, db_session):
    user = User(
        email=f"bell-api-{uuid4().hex}@example.com",
        password_hash=hash_password("password123"),
    )
    db_session.add(user)
    db_session.commit()

    q = Question(category="reading", type="fill-in-the-blanks", title="Feed Blanks",
                 difficulty="medium", content={})
    db_session.add(q)
    db_session.commit()

    db_session.add(Attempt(
        user_id=user.id, question_id=q.id, category="reading",
        question_type="fill-in-the-blanks", status="completed", score=8, answer={},
        created_at=datetime.now(UTC),
    ))
    db_session.commit()

    from app.core.security import create_access_token
    token = create_access_token(user_id=user.id, token_version=user.token_version)
    uid, qid = user.id, q.id
    yield f"Bearer {token}", uid, qid

    db_session.query(Attempt).filter(Attempt.user_id == uid).delete()
    db_session.query(Question).filter(Question.id == qid).delete()
    db_session.query(User).filter(User.id == uid).delete()
    db_session.commit()


def test_requires_authentication(client):
    assert client.get("/api/v1/notifications").status_code == 401
    assert client.post("/api/v1/notifications/read").status_code == 401


def test_unread_count_reflects_real_items(client, bell_user):
    auth, _, _ = bell_user
    r = client.get("/api/v1/notifications", headers={"Authorization": auth})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["unread_count"] == 1
    assert len(body["items"]) == 1
    item = body["items"][0]
    assert item["read"] is False
    assert "8/10" in item["body"]


def test_marking_read_clears_the_badge(client, bell_user):
    auth, _, _ = bell_user
    assert client.post("/api/v1/notifications/read", headers={"Authorization": auth}).status_code == 200
    r = client.get("/api/v1/notifications", headers={"Authorization": auth})
    body = r.json()
    assert body["unread_count"] == 0, "badge should clear after opening the feed"
    assert body["items"][0]["read"] is True


def test_a_fresh_cursor_leaves_items_unread(client, db_session, bell_user):
    """Advancing the cursor must not retroactively mark unseen newer items read."""
    auth, uid, qid = bell_user
    client.post("/api/v1/notifications/read", headers={"Authorization": auth})

    # A newer attempt arrives after the cursor was set.
    db_session.add(Attempt(
        user_id=uid, question_id=qid, category="reading",
        question_type="fill-in-the-blanks", status="completed", score=4, answer={},
        created_at=datetime.now(UTC) + timedelta(minutes=5),
    ))
    db_session.commit()

    r = client.get("/api/v1/notifications", headers={"Authorization": auth})
    body = r.json()
    assert body["unread_count"] == 1, "a newer item must read as unread"
    assert body["items"][0]["read"] is False


def test_items_are_scoped_to_the_current_user(client, db_session, bell_user):
    """One user's feed must never include another user's work."""
    auth, _, _ = bell_user
    other = User(
        email=f"bell-other-{uuid4().hex}@example.com",
        password_hash=hash_password("password123"),
    )
    db_session.add(other)
    db_session.commit()
    q = Question(category="writing", type="essay", title="Other essay", difficulty="medium", content={})
    db_session.add(q)
    db_session.commit()
    db_session.add(Attempt(
        user_id=other.id, question_id=q.id, category="writing", question_type="essay",
        status="completed", score=10, answer={}, created_at=datetime.now(UTC),
    ))
    db_session.commit()
    oid, oqid = other.id, q.id

    body = client.get("/api/v1/notifications", headers={"Authorization": auth}).json()
    assert all(i["kind"] != "practice_scored" or "Other essay" not in i["body"] for i in body["items"])
    assert all("Other essay" not in i["body"] for i in body["items"])

    db_session.query(Attempt).filter(Attempt.user_id == oid).delete()
    db_session.query(Question).filter(Question.id == oqid).delete()
    db_session.query(User).filter(User.id == oid).delete()
    db_session.commit()


def test_empty_feed_has_no_unread(client, db_session):
    user = User(
        email=f"bell-empty-{uuid4().hex}@example.com",
        password_hash=hash_password("password123"),
    )
    db_session.add(user)
    db_session.commit()
    from app.core.security import create_access_token
    token = create_access_token(user_id=user.id, token_version=user.token_version)
    uid = user.id

    body = client.get(
        "/api/v1/notifications",
        headers={"Authorization": f"Bearer {token}"},
    ).json()
    assert body == {"items": [], "unread_count": 0}

    db_session.query(User).filter(User.id == uid).delete()
    db_session.commit()