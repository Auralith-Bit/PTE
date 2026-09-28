"""Password-reset tests.

No SMTP server is used: the mailer is stubbed so the reset link can be captured
straight from the argument it was called with. The test database is session
scoped, so every test registers its own unique address.
"""
import hashlib
import uuid
from urllib.parse import parse_qs, urlparse

import pytest

from app.core.config import settings
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.services import password_reset

OLD_PASSWORD = "oldpassword1"
NEW_PASSWORD = "brandnewpass1"


@pytest.fixture
def email() -> str:
    return f"reset-{uuid.uuid4().hex[:12]}@example.com"


@pytest.fixture(autouse=True)
def _capture_reset_link(monkeypatch):
    """Capture the emailed link instead of sending it."""
    captured: list[str] = []

    def fake_send(to_email: str, reset_url: str) -> bool:
        captured.append(reset_url)
        return True

    monkeypatch.setattr(password_reset.mailer, "send_password_reset", fake_send)
    return captured


def _register(client, email, password=OLD_PASSWORD):
    res = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "full_name": "Reset User"},
    )
    assert res.status_code == 201, res.text
    return res.json()


def _request_reset(client, email):
    return client.post("/api/v1/auth/forgot-password", json={"email": email})


def _token_from(captured, index=0) -> str:
    return parse_qs(urlparse(captured[index]).query)["token"][0]


def _reset(client, token, new_password=NEW_PASSWORD):
    return client.post(
        "/api/v1/auth/reset-password", json={"token": token, "new_password": new_password}
    )


def _login(client, email, password):
    return client.post("/api/v1/auth/login", json={"email": email, "password": password})


# ── request endpoint ──────────────────────────────────────────────────────────


def test_forgot_password_accepts_request(client, email, _capture_reset_link):
    _register(client, email)
    res = _request_reset(client, email)
    assert res.status_code == 202
    assert "if an account exists" in res.json()["message"].lower()
    assert len(_capture_reset_link) == 1


def test_forgot_password_message_identical_for_unknown_email(client, email, _capture_reset_link):
    """The response must not reveal whether the address is registered."""
    _register(client, email)
    known = _request_reset(client, email)
    unknown = _request_reset(client, "nobody-here@example.com")

    assert known.status_code == unknown.status_code == 202
    assert known.json() == unknown.json()
    # Only the real account produced an email.
    assert len(_capture_reset_link) == 1


def test_forgot_password_is_case_insensitive(client, email, _capture_reset_link):
    _register(client, email)
    _request_reset(client, email.upper())
    assert len(_capture_reset_link) == 1
    expected_base = settings.frontend_url.rstrip("/") + "/reset-password"
    assert _capture_reset_link[0].startswith(expected_base)


def test_forgot_password_stores_only_a_hash(client, email, _capture_reset_link, db_session):
    registered = _register(client, email)
    _request_reset(client, email)

    record = (
        db_session.query(PasswordResetToken)
        .filter(PasswordResetToken.user_id == registered["id"])
        .one()
    )
    raw = _token_from(_capture_reset_link)
    assert record.token_hash == hashlib.sha256(raw.encode()).hexdigest()
    assert raw not in record.token_hash
    assert record.used_at is None


def test_forgot_password_rejects_malformed_email(client):
    res = client.post("/api/v1/auth/forgot-password", json={"email": "not-an-email"})
    assert res.status_code == 422


def test_forgot_password_skips_oauth_only_account(client, email, _capture_reset_link, db_session):
    registered = _register(client, email)
    row = db_session.query(User).filter(User.email == email).one()
    row.auth_provider = "google"
    row.provider_user_id = "google-sub-reset"
    row.password_hash = None
    db_session.commit()

    res = _request_reset(client, email)
    assert res.status_code == 202
    assert _capture_reset_link == []
    assert (
        db_session.query(PasswordResetToken)
        .filter(PasswordResetToken.user_id == registered["id"])
        .count()
        == 0
    )


def test_new_request_supersedes_the_previous_token(client, email, _capture_reset_link):
    _register(client, email)
    _request_reset(client, email)
    first = _token_from(_capture_reset_link, 0)

    _request_reset(client, email)
    second = _token_from(_capture_reset_link, 1)

    assert _reset(client, first).status_code == 400
    assert _reset(client, second).status_code == 200


# ── redeem endpoint ───────────────────────────────────────────────────────────


def test_reset_password_sets_the_new_password(client, email, _capture_reset_link):
    _register(client, email)
    _request_reset(client, email)
    res = _reset(client, _token_from(_capture_reset_link))
    assert res.status_code == 200
    assert "sign in now" in res.json()["message"].lower()

    assert _login(client, email, NEW_PASSWORD).status_code == 200


def test_old_password_stops_working(client, email, _capture_reset_link):
    _register(client, email)
    _request_reset(client, email)
    _reset(client, _token_from(_capture_reset_link))

    assert _login(client, email, OLD_PASSWORD).status_code == 401


def test_reset_token_is_single_use(client, email, _capture_reset_link):
    _register(client, email)
    _request_reset(client, email)
    token = _token_from(_capture_reset_link)

    assert _reset(client, token).status_code == 200
    assert _reset(client, token).status_code == 400


def test_reset_rejects_unknown_token(client, email):
    _register(client, email)
    res = _reset(client, "definitely-not-a-real-token-value")
    assert res.status_code == 400
    assert "invalid or has expired" in res.json()["detail"].lower()


def test_reset_rejects_expired_token(client, email, _capture_reset_link, monkeypatch):
    _register(client, email)
    monkeypatch.setattr(settings, "password_reset_ttl_minutes", -1)
    _request_reset(client, email)

    res = _reset(client, _token_from(_capture_reset_link))
    assert res.status_code == 400
    assert "invalid or has expired" in res.json()["detail"].lower()
    assert _login(client, email, NEW_PASSWORD).status_code == 401


def test_reset_enforces_password_length(client, email, _capture_reset_link):
    _register(client, email)
    _request_reset(client, email)
    res = _reset(client, _token_from(_capture_reset_link), new_password="short")
    assert res.status_code == 422


def test_reset_rejects_missing_token(client):
    res = client.post("/api/v1/auth/reset-password", json={"new_password": NEW_PASSWORD})
    assert res.status_code == 422


# ── session invalidation ──────────────────────────────────────────────────────


def test_reset_invalidates_existing_sessions(client, email, _capture_reset_link):
    _register(client, email)
    before = _login(client, email, OLD_PASSWORD).json()

    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {before['access_token']}"})
    assert me.status_code == 200

    _request_reset(client, email)
    _reset(client, _token_from(_capture_reset_link))

    # Both the access token and the refresh token from before the reset are dead.
    after_me = client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {before['access_token']}"}
    )
    assert after_me.status_code == 401
    refresh = client.post("/api/v1/auth/refresh", json={"refresh_token": before["refresh_token"]})
    assert refresh.status_code == 401

    # A fresh sign-in works and its tokens are good.
    fresh = _login(client, email, NEW_PASSWORD).json()
    fresh_me = client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {fresh['access_token']}"}
    )
    assert fresh_me.status_code == 200


def test_change_password_also_invalidates_sessions(client, email):
    _register(client, email)
    tokens = _login(client, email, OLD_PASSWORD).json()

    change = client.post(
        "/api/v1/auth/change-password",
        json={"current_password": OLD_PASSWORD, "new_password": NEW_PASSWORD},
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert change.status_code == 200

    assert (
        client.get(
            "/api/v1/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"}
        ).status_code
        == 401
    )
    assert _login(client, email, NEW_PASSWORD).status_code == 200


def test_oauth_only_account_is_left_alone(client, email, _capture_reset_link, db_session):
    _register(client, email)
    row = db_session.query(User).filter(User.email == email).one()
    row.auth_provider = "google"
    row.provider_user_id = "google-sub-no-reset"
    row.password_hash = None
    db_session.commit()

    _request_reset(client, email)
    assert _capture_reset_link == []
    assert row.auth_provider == "google"
