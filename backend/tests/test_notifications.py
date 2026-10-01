"""Notification feed tests.

The important property here is user isolation: notification ids are
sequential and guessable, so every endpoint must scope its lookup to the
caller. A test that lets user B read or acknowledge user A's row is a real
vulnerability, not a cosmetic bug, so each isolation case is pinned separately.

The test database is session scoped, so every test registers its own unique
address to stay independent of ordering.
"""
import uuid

import pytest
from sqlalchemy import func, select

from app.models.notification import Notification
from app.models.user import User

PASSWORD = "notifpassword1"


@pytest.fixture
def alice(client):
    return _make_user(client, "alice")


@pytest.fixture
def bob(client):
    return _make_user(client, "bob")


def _make_user(client, name):
    email = f"notif-{name}-{uuid.uuid4().hex[:12]}@example.com"
    res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": PASSWORD, "full_name": f"{name.title()} User"},
    )
    assert res.status_code == 201, res.text
    user = res.json()
    token = client.post(
        "/api/v1/auth/login", json={"email": email, "password": PASSWORD}
    ).json()["access_token"]
    return {"id": user["id"], "token": token}


def _auth(user):
    return {"Authorization": f"Bearer {user['token']}"}


def _add(user_id, is_read=False, href="/mock-test"):
    """Insert a notification directly so ids are known before the API call."""
    from app.core.database import SessionLocal

    session = SessionLocal()
    try:
        row = Notification(
            user_id=user_id,
            title=f"Note for {user_id}",
            body="body text",
            href=href,
            is_read=is_read,
        )
        session.add(row)
        session.commit()
        session.refresh(row)
        return row.id
    finally:
        session.close()


# ── listing ───────────────────────────────────────────────────────────────────


def test_list_requires_authentication(client):
    assert client.get("/api/v1/notifications").status_code == 401


def test_list_returns_only_the_callers_rows(client, alice, bob):
    _add(alice["id"])
    _add(alice["id"])
    _add(bob["id"])

    res = client.get("/api/v1/notifications", headers=_auth(alice))
    assert res.status_code == 200, res.text
    data = res.json()

    assert data["total"] == 2
    assert len(data["items"]) == 2
    assert all(item["title"] == f"Note for {alice['id']}" for item in data["items"])
    # Bob's row must not appear anywhere in Alice's response.
    assert f"Note for {bob['id']}" not in res.text


def test_unread_count_only_counts_unread_rows_of_the_caller(client, alice, bob):
    _add(alice["id"], is_read=False)
    _add(alice["id"], is_read=False)
    _add(alice["id"], is_read=True)
    _add(bob["id"], is_read=False)

    data = client.get("/api/v1/notifications", headers=_auth(alice)).json()
    assert data["unread_count"] == 2


def test_list_is_newest_first(client, alice):
    """The feed is ordered newest-first, not by insertion order.

    Rows are inserted oldest, newest, middle, so a query that ordered by id
    (the implicit default here) would return a visibly wrong sequence.
    """
    from datetime import timedelta

    from app.core.database import SessionLocal
    from app.core.time_utils import utcnow

    base = utcnow()
    # hours-ago per title; 1 is the newest, 3 the oldest.
    expected = ["offset-1", "offset-2", "offset-3"]

    session = SessionLocal()
    try:
        for offset in (3, 1, 2):
            session.add(
                Notification(
                    user_id=alice["id"],
                    title=f"offset-{offset}",
                    body="b",
                    is_read=False,
                    created_at=base - timedelta(hours=offset),
                )
            )
        session.commit()
    finally:
        session.close()

    data = client.get("/api/v1/notifications", headers=_auth(alice)).json()
    assert [item["title"] for item in data["items"]] == expected


# ── mark one read ─────────────────────────────────────────────────────────────


def test_mark_read_requires_authentication(client, alice):
    notification_id = _add(alice["id"])
    assert (
        client.post(f"/api/v1/notifications/{notification_id}/read").status_code == 401
    )


def test_mark_read_clears_the_row_and_the_count(client, alice):
    notification_id = _add(alice["id"], is_read=False)

    res = client.post(
        f"/api/v1/notifications/{notification_id}/read", headers=_auth(alice)
    )
    assert res.status_code == 200, res.text
    assert res.json()["is_read"] is True

    data = client.get("/api/v1/notifications", headers=_auth(alice)).json()
    assert data["unread_count"] == 0


def test_cannot_mark_another_users_notification_read(client, alice, bob):
    """Bob must not be able to acknowledge Alice's notification by id."""
    alice_notification = _add(alice["id"], is_read=False)

    res = client.post(
        f"/api/v1/notifications/{alice_notification}/read", headers=_auth(bob)
    )
    assert res.status_code == 404, res.text

    # And the row must be untouched.
    data = client.get("/api/v1/notifications", headers=_auth(alice)).json()
    assert data["unread_count"] == 1


def test_mark_read_is_idempotent(client, alice):
    notification_id = _add(alice["id"], is_read=False)

    first = client.post(
        f"/api/v1/notifications/{notification_id}/read", headers=_auth(alice)
    )
    second = client.post(
        f"/api/v1/notifications/{notification_id}/read", headers=_auth(alice)
    )
    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json()["is_read"] is True


def test_mark_read_on_unknown_id_is_404(client, alice):
    assert (
        client.post("/api/v1/notifications/99999999/read", headers=_auth(alice)).status_code
        == 404
    )


# ── mark all read ─────────────────────────────────────────────────────────────


def test_mark_all_read_requires_authentication(client, alice):
    assert client.post("/api/v1/notifications/read-all").status_code == 401


def test_mark_all_read_clears_only_the_callers_unread(client, alice, bob):
    _add(alice["id"], is_read=False)
    _add(alice["id"], is_read=False)
    _add(bob["id"], is_read=False)

    res = client.post("/api/v1/notifications/read-all", headers=_auth(alice))
    assert res.status_code == 200, res.text
    assert res.json()["unread_count"] == 0

    # Bob's unread count is unaffected.
    bob_data = client.get("/api/v1/notifications", headers=_auth(bob)).json()
    assert bob_data["unread_count"] == 1


def test_mark_all_read_preserves_already_read_rows(client, alice):
    _add(alice["id"], is_read=False)
    _add(alice["id"], is_read=True)

    data = client.post(
        "/api/v1/notifications/read-all", headers=_auth(alice)
    ).json()
    assert data["unread_count"] == 0
    assert len(data["items"]) == 2


# ── cascade ───────────────────────────────────────────────────────────────────


def test_deleting_a_user_removes_their_notifications(db_session, alice):
    """The FK is ON DELETE CASCADE, so an orphaned row cannot survive."""
    _add(alice["id"], is_read=False)
    user_id = alice["id"]

    remaining = db_session.scalar(
        select(func.count())
        .select_from(Notification)
        .where(Notification.user_id == user_id)
    )
    assert remaining == 1

    user = db_session.get(User, user_id)
    db_session.delete(user)
    db_session.commit()

    after = db_session.scalar(
        select(func.count())
        .select_from(Notification)
        .where(Notification.user_id == user_id)
    )
    assert after == 0


# ── seeder ────────────────────────────────────────────────────────────────────


def test_seed_notifications_is_idempotent(db_session):
    from app.db.init_db import seed_notifications

    first = seed_notifications()
    second = seed_notifications()
    # The second run must not duplicate an existing user's feed.
    assert second == 0
    assert first >= 0


def test_seed_mixes_read_and_unread(db_session):
    """Both badge states need to be reachable in dev without real events."""
    from app.db.init_db import SEED_NOTIFICATIONS

    assert any(n["is_read"] for n in SEED_NOTIFICATIONS)
    assert any(not n["is_read"] for n in SEED_NOTIFICATIONS)