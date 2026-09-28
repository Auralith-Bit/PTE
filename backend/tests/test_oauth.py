"""OAuth sign-in tests.

The provider is never contacted: the token and userinfo calls are replaced with
fakes so the suite stays offline and deterministic.
"""
import base64
import hashlib
from urllib.parse import parse_qs, urlparse

import jwt
import pytest

from app.core import oauth_codes
from app.core.config import settings
from app.services import oauth

GOOGLE_ID = "google-test-id.apps.googleusercontent.com"
GOOGLE_SECRET = "google-test-secret"
FB_ID = "facebook-test-id"
FB_SECRET = "facebook-test-secret"

NEW_USER_EMAIL = "oauth-new-user@example.com"
OTHER_USER_EMAIL = "oauth-other@example.com"
EXISTING_EMAIL = "oauth-preexisting@example.com"


@pytest.fixture(autouse=True)
def _reset_oauth_settings(monkeypatch):
    """Every test starts with no provider configured and an empty code store."""
    for field in (
        "google_client_id",
        "google_client_secret",
        "facebook_client_id",
        "facebook_client_secret",
        "apple_client_id",
        "apple_team_id",
        "apple_key_id",
        "apple_private_key",
        "apple_private_key_path",
        "apple_client_secret",
        "apple_audiences",
    ):
        monkeypatch.setattr(settings, field, None)
    oauth_codes._codes.clear()
    yield
    oauth_codes._codes.clear()


@pytest.fixture
def google_enabled(monkeypatch):
    monkeypatch.setattr(settings, "google_client_id", GOOGLE_ID)
    monkeypatch.setattr(settings, "google_client_secret", GOOGLE_SECRET)


@pytest.fixture
def facebook_enabled(monkeypatch):
    monkeypatch.setattr(settings, "facebook_client_id", FB_ID)
    monkeypatch.setattr(settings, "facebook_client_secret", FB_SECRET)


@pytest.fixture
def fake_google(monkeypatch):
    """Stub out the two network calls for a successful Google sign-in."""

    async def fake_token(config, code, verifier, nonce):
        assert config.name == "google"
        assert code == "test-auth-code"
        assert verifier
        return oauth.ProviderTokenResponse(access_token="provider-access-token")

    async def fake_identity(config, tokens, nonce, user_field=None):
        assert tokens.access_token == "provider-access-token"
        return oauth.ProviderIdentity(
            provider_user_id="google-sub-123",
            email=NEW_USER_EMAIL,
            full_name="Oauth New User",
            avatar_url="https://example.com/a.png",
        )

    monkeypatch.setattr(oauth, "fetch_token", fake_token)
    monkeypatch.setattr(oauth, "fetch_identity", fake_identity)


def _start(client, provider="google", next_path=None):
    url = f"/api/v1/auth/oauth/{provider}/start"
    if next_path is not None:
        url += f"?next={next_path}"
    return client.get(url, follow_redirects=False)


def _callback(client, provider, state, code="test-auth-code"):
    return client.get(
        f"/api/v1/auth/oauth/{provider}/callback",
        params={"code": code, "state": state},
        follow_redirects=False,
    )


def _location(response):
    return urlparse(response.headers["location"])


def _query(response):
    return parse_qs(_location(response).query)


def test_providers_empty_when_unconfigured(client):
    res = client.get("/api/v1/auth/oauth/providers")
    assert res.status_code == 200
    assert res.json() == {"providers": {}}


def test_providers_lists_only_configured(client, google_enabled):
    res = client.get("/api/v1/auth/oauth/providers")
    assert res.json() == {"providers": {"google": "Google"}}


def test_providers_lists_both(client, google_enabled, facebook_enabled):
    res = client.get("/api/v1/auth/oauth/providers")
    assert res.json() == {"providers": {"google": "Google", "facebook": "Facebook"}}


def test_start_redirects_to_google_with_pkce(client, google_enabled):
    res = _start(client)
    assert res.status_code == 302
    location = _location(res)
    assert location.netloc == "accounts.google.com"

    params = parse_qs(location.query)
    assert params["client_id"] == [GOOGLE_ID]
    assert params["response_type"] == ["code"]
    assert params["code_challenge_method"] == ["S256"]
    assert params["redirect_uri"] == [
        f"{settings.backend_public_url.rstrip('/')}/api/v1/auth/oauth/google/callback"
    ]
    assert params["state"]


def test_start_sets_httponly_csrf_cookie(client, google_enabled):
    res = _start(client)
    cookie = res.headers.get("set-cookie", "")
    assert "pte_oauth_csrf=" in cookie
    assert "HttpOnly" in cookie
    assert "SameSite=lax" in cookie.replace("samesite", "SameSite")


def test_start_unknown_provider_404(client, google_enabled):
    res = _start(client, provider="myspace")
    assert res.status_code == 404


def test_start_unconfigured_provider_404(client):
    res = _start(client, provider="google")
    assert res.status_code == 404


def test_start_honours_next_path(client, google_enabled):
    res = _start(client, next_path="/mock-test")
    state = parse_qs(_location(res).query)["state"][0]
    payload = jwt.decode(state, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    assert payload["next"] == "/mock-test"


def test_start_sanitises_offsite_next_path(client, google_enabled):
    for hostile in ("//evil.example.com", "https://evil.example.com", ""):
        res = _start(client, next_path=hostile)
        state = parse_qs(_location(res).query)["state"][0]
        payload = jwt.decode(state, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        assert payload["next"] == "/dashboard"


def test_state_code_challenge_matches_verifier(client, google_enabled):
    res = _start(client)
    params = parse_qs(_location(res).query)
    state = jwt.decode(params["state"][0], settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    expected = (
        base64.urlsafe_b64encode(hashlib.sha256(state["verifier"].encode("ascii")).digest())
        .rstrip(b"=")
        .decode("ascii")
    )
    assert params["code_challenge"] == [expected]


def test_callback_creates_user_and_redirects_with_code(client, google_enabled, fake_google):
    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]

    res = _callback(client, "google", state)
    assert res.status_code == 302
    assert _location(res).netloc == "localhost:3000"
    assert _location(res).path == "/auth/callback"
    assert "error" not in _query(res)


def test_exchange_returns_tokens_user_and_next(client, google_enabled, fake_google):
    start = _start(client, next_path="/mock-test")
    state = parse_qs(_location(start).query)["state"][0]
    code = _query(_callback(client, "google", state))["code"][0]

    res = client.post("/api/v1/auth/oauth/exchange", json={"code": code})
    assert res.status_code == 200
    body = res.json()
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["user"]["email"] == NEW_USER_EMAIL
    assert body["user"]["full_name"] == "Oauth New User"
    assert "password_hash" not in body["user"]
    assert body["next"] == "/mock-test"

    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {body['access_token']}"})
    assert me.status_code == 200
    assert me.json()["email"] == NEW_USER_EMAIL


def test_exchange_code_is_single_use(client, google_enabled, fake_google):
    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    code = _query(_callback(client, "google", state))["code"][0]

    assert client.post("/api/v1/auth/oauth/exchange", json={"code": code}).status_code == 200
    assert client.post("/api/v1/auth/oauth/exchange", json={"code": code}).status_code == 401


def test_exchange_rejects_unknown_code(client, google_enabled):
    res = client.post("/api/v1/auth/oauth/exchange", json={"code": "not-a-real-code"})
    assert res.status_code == 401


def test_exchange_rejects_expired_code(client, google_enabled, fake_google, monkeypatch):
    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    code = _query(_callback(client, "google", state))["code"][0]

    monkeypatch.setattr(settings, "oauth_code_ttl_seconds", -1)
    # Re-issued with a negative TTL so it is already expired on creation.
    expired = oauth_codes.issue_code(1, "/dashboard", -1)
    assert client.post("/api/v1/auth/oauth/exchange", json={"code": expired}).status_code == 401
    assert client.post("/api/v1/auth/oauth/exchange", json={"code": code}).status_code == 200


def test_callback_reuses_account_on_second_signin(client, google_enabled, fake_google, db_session):
    for _ in range(2):
        client.cookies.clear()
        start = _start(client)
        state = parse_qs(_location(start).query)["state"][0]
        code = _query(_callback(client, "google", state))["code"][0]
        body = client.post("/api/v1/auth/oauth/exchange", json={"code": code}).json()
        assert body["user"]["email"] == NEW_USER_EMAIL

    from app.models.user import User

    matches = db_session.query(User).filter(User.email == NEW_USER_EMAIL).all()
    assert len(matches) == 1
    assert matches[0].auth_provider == "google"
    assert matches[0].provider_user_id == "google-sub-123"
    assert matches[0].password_hash is None


def test_callback_fails_csrf_check_without_cookie(client, google_enabled, fake_google):
    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    client.cookies.clear()

    res = _callback(client, "google", state)
    assert res.status_code == 302
    query = _query(res)
    assert "code" not in query
    assert "error" in query


def test_callback_rejects_provider_mismatch(client, google_enabled, facebook_enabled, fake_google):
    start = _start(client, provider="google")
    state = parse_qs(_location(start).query)["state"][0]

    res = _callback(client, "facebook", state)
    assert "code" not in _query(res)
    assert "error" in _query(res)


def test_form_post_callback_cannot_bypass_csrf_for_get_providers(
    client, google_enabled, fake_google
):
    """The form-POST route exists for Apple only.

    Google and Facebook return their callback over a top-level GET, which does
    replay the SameSite=Lax cookie. If they were also allowed to complete over a
    cross-site POST without that cookie, the CSRF check would be trivially
    bypassable, so posting to the callback must fail for them.
    """
    start = _start(client, provider="google")
    state = parse_qs(_location(start).query)["state"][0]
    client.cookies.clear()

    res = client.post(
        "/api/v1/auth/oauth/google/callback",
        data={"code": "auth-code", "state": state},
        follow_redirects=False,
    )
    assert res.status_code == 302
    query = _query(res)
    assert "code" not in query
    assert "error" in query



def test_callback_rejects_tampered_state(client, google_enabled, fake_google):
    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    tampered = state[:-4] + ("aaaa" if not state.endswith("aaaa") else "bbbb")

    res = _callback(client, "google", tampered)
    assert "code" not in _query(res)
    assert "error" in _query(res)


def test_callback_reports_provider_error(client, google_enabled):
    res = client.get(
        "/api/v1/auth/oauth/google/callback",
        params={"error": "access_denied"},
        follow_redirects=False,
    )
    assert res.status_code == 302
    assert "error" in _query(res)


def test_callback_refuses_to_take_over_password_account(client, google_enabled, monkeypatch):
    """A Google account sharing an email with a local password account is rejected."""
    assert (
        client.post(
            "/api/v1/auth/register",
            json={"email": EXISTING_EMAIL, "password": "password123", "full_name": "Existing"},
        ).status_code
        == 201
    )

    async def fake_token(config, code, verifier, nonce):
        return oauth.ProviderTokenResponse(access_token="provider-access-token")

    async def fake_identity(config, tokens, nonce, user_field=None):
        return oauth.ProviderIdentity(
            provider_user_id="google-sub-999",
            email=EXISTING_EMAIL,
            full_name="Impostor",
            avatar_url=None,
        )

    monkeypatch.setattr(oauth, "fetch_token", fake_token)
    monkeypatch.setattr(oauth, "fetch_identity", fake_identity)

    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    res = _callback(client, "google", state)

    query = _query(res)
    assert "code" not in query
    assert "already exists" in query["error"][0]

    # The original password account still works and is untouched.
    login = client.post("/api/v1/auth/login", json={"email": EXISTING_EMAIL, "password": "password123"})
    assert login.status_code == 200


def test_callback_rejects_unverified_google_email(client, google_enabled, monkeypatch):
    async def fake_token(config, code, verifier, nonce):
        return oauth.ProviderTokenResponse(access_token="provider-access-token")

    async def fake_identity(config, tokens, nonce, user_field=None):
        return oauth.ProviderIdentity(
            provider_user_id="google-sub-unverified",
            email=OTHER_USER_EMAIL,
            full_name="Unverified",
            avatar_url=None,
        )
    monkeypatch.setattr(oauth, "fetch_token", fake_token)
    monkeypatch.setattr(oauth, "fetch_identity", fake_identity)

    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    res = _callback(client, "google", state)
    assert "code" in _query(res)

    # And an identity with no email at all is refused.
    with pytest.raises(oauth.OAuthError):
        oauth._require_email({"email": None, "email_verified": True}, "Google")
    with pytest.raises(oauth.OAuthError):
        oauth._require_email({"email": "a@b.com", "email_verified": False}, "Google")


def test_facebook_start_uses_graph_dialog(client, facebook_enabled):
    res = _start(client, provider="facebook")
    assert res.status_code == 302
    location = _location(res)
    assert location.netloc == "graph.facebook.com"
    assert location.path.endswith("/dialog/oauth")
    params = parse_qs(location.query)
    assert params["client_id"] == [FB_ID]
    assert params["code_challenge_method"] == ["S256"]


def test_facebook_callback_creates_user(client, facebook_enabled, monkeypatch):
    async def fake_token(config, code, verifier, nonce):
        assert config.name == "facebook"
        return oauth.ProviderTokenResponse(access_token="fb-access-token")

    async def fake_identity(config, tokens, nonce, user_field=None):
        return oauth.ProviderIdentity(
            provider_user_id="fb-555",
            email="oauth-fb-user@example.com",
            full_name="Fb User",
            avatar_url=None,
        )

    monkeypatch.setattr(oauth, "fetch_token", fake_token)
    monkeypatch.setattr(oauth, "fetch_identity", fake_identity)

    start = _start(client, provider="facebook")
    state = parse_qs(_location(start).query)["state"][0]
    code = _query(_callback(client, "facebook", state))["code"][0]

    body = client.post("/api/v1/auth/oauth/exchange", json={"code": code}).json()
    assert body["user"]["email"] == "oauth-fb-user@example.com"
    assert body["next"] == "/dashboard"


def test_provider_network_failure_reports_friendly_error(client, google_enabled, monkeypatch):
    async def boom(config, code, verifier, nonce):
        raise oauth.OAuthError("Could not reach Google. Please try again.")

    monkeypatch.setattr(oauth, "fetch_token", boom)

    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    res = _callback(client, "google", state)
    assert "code" not in _query(res)
    assert "Could not reach Google" in _query(res)["error"][0]


def test_password_login_refused_for_oauth_account(client, google_enabled, fake_google):
    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    code = _query(_callback(client, "google", state))["code"][0]
    client.post("/api/v1/auth/oauth/exchange", json={"code": code})

    res = client.post("/api/v1/auth/login", json={"email": NEW_USER_EMAIL, "password": "password123"})
    assert res.status_code == 400
    assert "Google" in res.json()["detail"]


def test_change_password_refused_for_oauth_account(client, google_enabled, fake_google):
    start = _start(client)
    state = parse_qs(_location(start).query)["state"][0]
    code = _query(_callback(client, "google", state))["code"][0]
    body = client.post("/api/v1/auth/oauth/exchange", json={"code": code}).json()

    res = client.post(
        "/api/v1/auth/change-password",
        json={"current_password": "whatever", "new_password": "newpassword1"},
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )
    assert res.status_code == 400
    assert "no password" in res.json()["detail"]


def test_password_account_still_logs_in_normally(client):
    assert (
        client.post(
            "/api/v1/auth/register",
            json={"email": "oauth-pw-user@example.com", "password": "password123"},
        ).status_code
        == 201
    )
    res = client.post(
        "/api/v1/auth/login", json={"email": "oauth-pw-user@example.com", "password": "password123"}
    )
    assert res.status_code == 200
