"""Sign in with Apple tests.

Apple is never contacted. The JWKS and token endpoints are replaced with an
httpx.MockTransport backed by a key pair generated in-process, so the id_token
signing, the client secret and the whole callback are exercised for real without
network access or Apple credentials.

The async service functions are driven with asyncio.run rather than
pytest-asyncio, which is not a declared dependency of this project.
"""
import asyncio
import base64
import json
import time
import uuid
from urllib.parse import parse_qs, urlparse

import httpx
import jwt
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec, rsa

from app.core import oauth_codes
from app.core.config import settings
from app.models.user import User
from app.services import apple as apple_service
from app.services import oauth

SERVICES_ID = "com.example.pteprep.web"
BUNDLE_ID = "com.example.pteprep"
TEAM_ID = "ABCDE12345"
KEY_ID = "FGHIJ67890"
APPLE_SUB = "apple-sub-0012345"
APPLE_EMAIL = "apple-user@example.com"
KID = "test-key-id"

# Captured before any monkeypatching: httpx.AsyncClient is patched globally below,
# so re-reading it inside the factory would wrap the previous fake instead.
_REAL_ASYNC_CLIENT = httpx.AsyncClient


def _b64u(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def _public_jwk(key: rsa.RSAPrivateKey, kid: str) -> dict:
    numbers = key.public_key().public_numbers()
    return {
        "kty": "RSA",
        "n": _b64u(numbers.n.to_bytes((numbers.n.bit_length() + 7) // 8, "big")),
        "e": _b64u(numbers.e.to_bytes((numbers.e.bit_length() + 7) // 8, "big")),
        "kid": kid,
        "alg": "RS256",
        "use": "sig",
    }


def _private_pem(key) -> str:
    return key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()


@pytest.fixture(scope="module")
def ec_key():
    """Signs the client secret, standing in for the downloaded .p8 file."""
    return _private_pem(ec.generate_private_key(ec.SECP256R1()))


@pytest.fixture(scope="module")
def apple_signing_key():
    return rsa.generate_private_key(public_exponent=65537, key_size=2048)


@pytest.fixture
def apple_jwks(apple_signing_key):
    return {
        "private_pem": _private_pem(apple_signing_key),
        "jwk": _public_jwk(apple_signing_key, KID),
    }


@pytest.fixture(autouse=True)
def _clean(monkeypatch):
    for field in (
        "apple_client_id",
        "apple_team_id",
        "apple_key_id",
        "apple_private_key",
        "apple_private_key_path",
        "apple_client_secret",
        "apple_audiences",
    ):
        monkeypatch.setattr(settings, field, None)
    apple_service._jwks_cache["fetched_at"] = 0.0
    apple_service._jwks_cache["keys"] = {}
    oauth_codes._codes.clear()
    yield
    oauth_codes._codes.clear()


@pytest.fixture
def apple_enabled(monkeypatch, ec_key):
    monkeypatch.setattr(settings, "apple_client_id", SERVICES_ID)
    monkeypatch.setattr(settings, "apple_team_id", TEAM_ID)
    monkeypatch.setattr(settings, "apple_key_id", KEY_ID)
    monkeypatch.setattr(settings, "apple_private_key", ec_key)


def make_id_token(apple_jwks, nonce, **overrides):
    claims = {
        "iss": "https://appleid.apple.com",
        "aud": SERVICES_ID,
        "sub": APPLE_SUB,
        "exp": int(time.time()) + 600,
        "iat": int(time.time()),
        "nonce": nonce,
        "email": APPLE_EMAIL,
        # Apple sends this as a string, not a boolean.
        "email_verified": "true",
    }
    claims.update(overrides)
    return jwt.encode(claims, apple_jwks["private_pem"], algorithm="RS256", headers={"kid": KID})


def install_apple_network(monkeypatch, apple_jwks, id_token, token_status=200, jwk_override=None):
    """Serve Apple's JWKS and token endpoints from memory."""
    seen = {"token_request": None}

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path.endswith("/auth/keys"):
            key = jwk_override or apple_jwks["jwk"]
            return httpx.Response(200, json={"keys": [key]})
        if request.url.path.endswith("/token"):
            seen["token_request"] = request
            if token_status >= 400:
                return httpx.Response(token_status, json={"error": "invalid_grant"})
            return httpx.Response(
                200,
                json={
                    "access_token": "apple-access-token",
                    "refresh_token": "apple-refresh-token",
                    "token_type": "Bearer",
                    "expires_in": 3600,
                    "id_token": id_token,
                },
            )
        return httpx.Response(404, json={"error": "unexpected"})

    original = _REAL_ASYNC_CLIENT

    def factory(*args, **kwargs):
        kwargs["transport"] = httpx.MockTransport(handler)
        return original(*args, **kwargs)

    monkeypatch.setattr(apple_service.httpx, "AsyncClient", factory)
    return seen


# ── configuration ─────────────────────────────────────────────────────────────


def test_apple_disabled_without_credentials():
    assert apple_service.enabled() is False
    assert "apple" not in oauth.enabled_providers()
    with pytest.raises(oauth.OAuthError):
        oauth.get_provider("apple")


def test_apple_disabled_with_only_client_id(monkeypatch):
    monkeypatch.setattr(settings, "apple_client_id", SERVICES_ID)
    assert apple_service.enabled() is False


def test_apple_enabled_with_key_material(apple_enabled):
    assert apple_service.enabled() is True
    config = oauth.get_provider("apple")
    assert config.name == "apple"
    assert config.display_name == "Apple"
    assert config.supports_pkce is False
    assert config.uses_form_post is True


def test_apple_enabled_with_static_secret(monkeypatch):
    monkeypatch.setattr(settings, "apple_client_id", SERVICES_ID)
    monkeypatch.setattr(settings, "apple_client_secret", "pre-generated.jwt")
    assert apple_service.enabled() is True
    assert apple_service.client_secret() == "pre-generated.jwt"


def test_apple_private_key_read_from_path(monkeypatch, tmp_path, ec_key):
    key_file = tmp_path / "AuthKey.p8"
    key_file.write_text(ec_key, encoding="utf-8")
    monkeypatch.setattr(settings, "apple_client_id", SERVICES_ID)
    monkeypatch.setattr(settings, "apple_team_id", TEAM_ID)
    monkeypatch.setattr(settings, "apple_key_id", KEY_ID)
    monkeypatch.setattr(settings, "apple_private_key_path", str(key_file))
    assert apple_service.enabled() is True
    assert "eyJ" in apple_service.client_secret()


def test_accepted_audiences_covers_native_ios(apple_enabled, monkeypatch):
    assert apple_service.accepted_audiences() == [SERVICES_ID]
    monkeypatch.setattr(settings, "apple_audiences", f"{BUNDLE_ID} , {SERVICES_ID}")
    assert apple_service.accepted_audiences() == [SERVICES_ID, BUNDLE_ID]


# ── client secret ─────────────────────────────────────────────────────────────


def test_client_secret_is_a_well_formed_apple_jwt(apple_enabled, ec_key):
    secret = apple_service.client_secret()
    header = jwt.get_unverified_header(secret)
    assert header["alg"] == "ES256"
    assert header["kid"] == KEY_ID

    claims = jwt.decode(
        secret,
        key=ec_key,
        algorithms=["ES256"],
        audience="https://appleid.apple.com",
    )
    assert claims["iss"] == TEAM_ID
    assert claims["sub"] == SERVICES_ID
    assert claims["aud"] == "https://appleid.apple.com"
    # Apple rejects anything valid for more than six months.
    assert claims["exp"] - claims["iat"] <= 180 * 24 * 60 * 60


def test_client_secret_ttl_is_capped_at_six_months(apple_enabled, ec_key, monkeypatch):
    monkeypatch.setattr(settings, "apple_client_secret_ttl_days", 3650)
    claims = jwt.decode(
        apple_service.client_secret(),
        key=ec_key,
        algorithms=["ES256"],
        audience="https://appleid.apple.com",
    )
    assert claims["exp"] - claims["iat"] == 180 * 24 * 60 * 60


def test_client_secret_accepts_escaped_newlines(monkeypatch, ec_key):
    escaped = ec_key.replace("\n", "\\n")
    monkeypatch.setattr(settings, "apple_client_id", SERVICES_ID)
    monkeypatch.setattr(settings, "apple_team_id", TEAM_ID)
    monkeypatch.setattr(settings, "apple_key_id", KEY_ID)
    monkeypatch.setattr(settings, "apple_private_key", escaped)
    assert "eyJ" in apple_service.client_secret()


def test_private_key_missing_reports_misconfiguration(monkeypatch):
    monkeypatch.setattr(settings, "apple_client_id", SERVICES_ID)
    monkeypatch.setattr(settings, "apple_team_id", TEAM_ID)
    monkeypatch.setattr(settings, "apple_key_id", KEY_ID)
    monkeypatch.setattr(settings, "apple_private_key_path", "no/such/file.p8")
    with pytest.raises(apple_service.AppleError):
        apple_service.client_secret()


# ── id_token verification ─────────────────────────────────────────────────────


def _verify_id_token(apple_jwks, token, nonce, monkeypatch, **kwargs):
    install_apple_network(monkeypatch, apple_jwks, token, **kwargs)
    return asyncio.run(apple_service.verify_id_token(token, nonce))


def test_verify_id_token_accepts_a_valid_token(apple_enabled, apple_jwks, monkeypatch):
    nonce = "nonce-value-123"
    claims = _verify_id_token(apple_jwks, make_id_token(apple_jwks, nonce), nonce, monkeypatch)
    assert claims["sub"] == APPLE_SUB
    assert claims["email"] == APPLE_EMAIL


def test_verify_id_token_accepts_native_ios_audience(apple_enabled, apple_jwks, monkeypatch):
    monkeypatch.setattr(settings, "apple_audiences", BUNDLE_ID)
    nonce = "nonce-ios"
    token = make_id_token(apple_jwks, nonce, aud=BUNDLE_ID)
    claims = _verify_id_token(apple_jwks, token, nonce, monkeypatch)
    assert claims["aud"] == BUNDLE_ID


def test_verify_id_token_rejects_nonce_mismatch(apple_enabled, apple_jwks, monkeypatch):
    token = make_id_token(apple_jwks, "one-nonce")
    with pytest.raises(apple_service.AppleError, match="could not be verified"):
        _verify_id_token(apple_jwks, token, "different-nonce", monkeypatch)


def test_verify_id_token_rejects_foreign_audience(apple_enabled, apple_jwks, monkeypatch):
    token = make_id_token(apple_jwks, "n", aud="com.evil.app")
    with pytest.raises(apple_service.AppleError):
        _verify_id_token(apple_jwks, token, "n", monkeypatch)


def test_verify_id_token_rejects_foreign_issuer(apple_enabled, apple_jwks, monkeypatch):
    token = make_id_token(apple_jwks, "n", iss="https://evil.example.com")
    with pytest.raises(apple_service.AppleError):
        _verify_id_token(apple_jwks, token, "n", monkeypatch)


def test_verify_id_token_rejects_expired(apple_enabled, apple_jwks, monkeypatch):
    token = make_id_token(apple_jwks, "n", exp=int(time.time()) - 60)
    with pytest.raises(apple_service.AppleError):
        _verify_id_token(apple_jwks, token, "n", monkeypatch)


def test_verify_id_token_rejects_a_different_signing_key(apple_enabled, apple_jwks, monkeypatch):
    """A token signed by an attacker must not verify against Apple's published key."""
    other = _private_pem(rsa.generate_private_key(public_exponent=65537, key_size=2048))
    token = jwt.encode(
        {
            "iss": "https://appleid.apple.com",
            "aud": SERVICES_ID,
            "sub": APPLE_SUB,
            "exp": int(time.time()) + 600,
            "nonce": "n",
            "email": "attacker@example.com",
        },
        other,
        algorithm="RS256",
        headers={"kid": KID},
    )
    with pytest.raises(apple_service.AppleError):
        _verify_id_token(apple_jwks, token, "n", monkeypatch)


def test_verify_id_token_rejects_unknown_kid(apple_enabled, apple_jwks, monkeypatch):
    """Halfway through a key rotation the cached key may not match the token."""
    token = make_id_token(apple_jwks, "n")
    assert jwt.get_unverified_header(token)["kid"] == KID
    rotated_away = _public_jwk(rsa.generate_private_key(public_exponent=65537, key_size=2048), "rotated-away")
    install_apple_network(monkeypatch, apple_jwks, token, jwk_override=rotated_away)
    with pytest.raises(apple_service.AppleError):
        asyncio.run(apple_service.verify_id_token(token, "n"))


def test_jwks_is_cached_between_verifications(apple_enabled, apple_jwks, monkeypatch):
    calls = {"n": 0}
    original = apple_service._load_signing_key

    async def counting(kid):
        calls["n"] += 1
        return await original(kid)

    monkeypatch.setattr(apple_service, "_load_signing_key", counting)
    token = make_id_token(apple_jwks, "n")
    install_apple_network(monkeypatch, apple_jwks, token)

    for _ in range(3):
        asyncio.run(apple_service.verify_id_token(token, "n"))
    # The second and third verification are served from the cache.
    assert calls["n"] == 3


def test_email_verified_string_is_understood():
    assert apple_service._email_is_verified("true") is True
    assert apple_service._email_is_verified(True) is True
    assert apple_service._email_is_verified("false") is False
    assert apple_service._email_is_verified(False) is False
    assert apple_service._email_is_verified(None) is False


# ── authorize URL ─────────────────────────────────────────────────────────────


def test_apple_start_uses_form_post_without_pkce(client, apple_enabled):
    res = client.get("/api/v1/auth/oauth/apple/start", follow_redirects=False)
    assert res.status_code == 302
    location = urlparse(res.headers["location"])
    assert location.netloc == "appleid.apple.com"
    assert location.path == "/auth/authorize"

    params = parse_qs(location.query)
    assert params["client_id"] == [SERVICES_ID]
    assert params["response_type"] == ["code"]
    # Apple demands form POST when a scope is present.
    assert params["response_mode"] == ["form_post"]
    assert params["scope"] == ["name email"]
    # Apple does not support PKCE.
    assert "code_challenge" not in params
    assert "code_challenge_method" not in params
    assert params["nonce"]
    assert params["redirect_uri"] == [
        f"{settings.backend_public_url.rstrip('/')}/api/v1/auth/oauth/apple/callback"
    ]


def test_apple_nonce_is_bound_to_the_state_token(client, apple_enabled):
    res = client.get("/api/v1/auth/oauth/apple/start", follow_redirects=False)
    params = parse_qs(urlparse(res.headers["location"]).query)
    state = jwt.decode(
        params["state"][0], settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
    )
    assert params["nonce"] == [state["csrf"]]


# ── full callback ─────────────────────────────────────────────────────────────


def _apple_start(client):
    res = client.get("/api/v1/auth/oauth/apple/start", follow_redirects=False)
    return parse_qs(urlparse(res.headers["location"]).query)


def _apple_post_callback(client, state, nonce, **extra):
    body = {"code": "apple-auth-code", "state": state, **extra}
    # Apple POSTs cross-site, so the SameSite=Lax cookie is not replayed.
    client.cookies.clear()
    return client.post(
        "/api/v1/auth/oauth/apple/callback",
        data=body,
        follow_redirects=False,
    )


def test_apple_callback_creates_user_and_issues_code(
    client, apple_enabled, apple_jwks, monkeypatch, db_session
):
    params = _apple_start(client)
    nonce = params["nonce"][0]
    install_apple_network(monkeypatch, apple_jwks, make_id_token(apple_jwks, nonce))

    res = _apple_post_callback(
        client,
        params["state"][0],
        nonce,
        user=json.dumps({"name": {"firstName": "Ada", "lastName": "Lovelace"}}),
    )
    assert res.status_code == 302
    location = urlparse(res.headers["location"])
    assert location.netloc == "localhost:3000"
    assert location.path == "/auth/callback"
    assert "error" not in parse_qs(location.query)

    code = parse_qs(location.query)["code"][0]
    body = client.post("/api/v1/auth/oauth/exchange", json={"code": code}).json()
    assert body["user"]["email"] == APPLE_EMAIL
    assert body["user"]["full_name"] == "Ada Lovelace"

    from app.models.user import User

    row = db_session.query(User).filter(User.email == APPLE_EMAIL).one()
    assert row.auth_provider == "apple"
    assert row.provider_user_id == APPLE_SUB
    assert row.password_hash is None


def test_apple_callback_works_without_a_name(client, apple_enabled, apple_jwks, monkeypatch):
    """Apple only shares the name on the first authorization."""
    params = _apple_start(client)
    nonce = params["nonce"][0]
    install_apple_network(monkeypatch, apple_jwks, make_id_token(apple_jwks, nonce))

    res = _apple_post_callback(client, params["state"][0], nonce)
    code = parse_qs(urlparse(res.headers["location"]).query)["code"][0]
    body = client.post("/api/v1/auth/oauth/exchange", json={"code": code}).json()
    assert body["user"]["email"] == APPLE_EMAIL


def test_apple_callback_returns_to_existing_account(
    client, apple_enabled, apple_jwks, monkeypatch, db_session
):
    """A second sign-in reuses the account instead of creating a duplicate."""
    email = f"apple-returning-{uuid.uuid4().hex[:8]}@example.com"
    sub = f"sub-{uuid.uuid4().hex[:6]}"
    for _ in range(2):
        params = _apple_start(client)
        nonce = params["nonce"][0]
        install_apple_network(
            monkeypatch, apple_jwks, make_id_token(apple_jwks, nonce, sub=sub, email=email)
        )
        res = _apple_post_callback(client, params["state"][0], nonce)
        code = parse_qs(urlparse(res.headers["location"]).query)["code"][0]
        body = client.post("/api/v1/auth/oauth/exchange", json={"code": code}).json()
        assert body["user"]["email"] == email

    matches = db_session.query(User).filter(User.email == email).all()
    assert len(matches) == 1
    assert matches[0].auth_provider == "apple"
    assert matches[0].provider_user_id == sub


def test_returning_apple_user_can_sign_in_without_an_email_claim(
    client, apple_enabled, apple_jwks, monkeypatch, db_session
):
    """Apple stops sending the email after the first authorization.

    Apple documents that a sign-in returns the user's name and email only on the
    first authorization for an app, and that the `sub` is the stable identifier
    to key on. Every later sign-in therefore arrives with no email at all, so
    requiring one would lock every returning Apple user out of their account.
    """
    email = f"apple-noemail-{uuid.uuid4().hex[:8]}@example.com"
    sub = f"sub-{uuid.uuid4().hex[:6]}"

    # First sign-in: Apple does share the email, so the account gets created.
    params = _apple_start(client)
    nonce = params["nonce"][0]
    install_apple_network(
        monkeypatch, apple_jwks, make_id_token(apple_jwks, nonce, sub=sub, email=email)
    )
    res = _apple_post_callback(client, params["state"][0], nonce)
    code = parse_qs(urlparse(res.headers["location"]).query)["code"][0]
    first = client.post("/api/v1/auth/oauth/exchange", json={"code": code}).json()
    assert first["user"]["email"] == email

    # Second sign-in: no email, no email_verified, no name -- only the `sub`.
    params = _apple_start(client)
    nonce = params["nonce"][0]
    id_token = jwt.encode(
        {
            "iss": "https://appleid.apple.com",
            "aud": SERVICES_ID,
            "sub": sub,
            "exp": int(time.time()) + 600,
            "iat": int(time.time()),
            "nonce": nonce,
        },
        apple_jwks["private_pem"],
        algorithm="RS256",
        headers={"kid": KID},
    )
    install_apple_network(monkeypatch, apple_jwks, id_token)
    res = _apple_post_callback(client, params["state"][0], nonce)
    assert res.status_code == 302
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "error" not in query, query

    code = query["code"][0]
    second = client.post("/api/v1/auth/oauth/exchange", json={"code": code}).json()
    assert second["user"]["email"] == email
    assert second["access_token"]

    # Still exactly one account, and it kept its original email.
    assert len(db_session.query(User).filter(User.email == email).all()) == 1


def test_unknown_apple_user_without_an_email_claim_is_told_to_sign_up_again(
    client, apple_enabled, apple_jwks, monkeypatch
):
    """No stored account and no email means we cannot create one.

    This is what happens when a user's very first sign-in never reached our
    server: Apple will not hand over the email a second time, so the honest
    response is to ask them to sign up again rather than fail vaguely.
    """
    params = _apple_start(client)
    nonce = params["nonce"][0]
    id_token = jwt.encode(
        {
            "iss": "https://appleid.apple.com",
            "aud": SERVICES_ID,
            "sub": f"sub-{uuid.uuid4().hex[:6]}",
            "exp": int(time.time()) + 600,
            "iat": int(time.time()),
            "nonce": nonce,
        },
        apple_jwks["private_pem"],
        algorithm="RS256",
        headers={"kid": KID},
    )
    install_apple_network(monkeypatch, apple_jwks, id_token)
    res = _apple_post_callback(client, params["state"][0], nonce)

    assert res.status_code == 302
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "code" not in query
    assert "sign up again" in query["error"][0].lower()


def test_apple_rejects_unverified_email_when_one_is_presented(
    client, apple_enabled, apple_jwks, monkeypatch
):
    """A supplied but unverified email is still refused."""
    params = _apple_start(client)
    nonce = params["nonce"][0]
    install_apple_network(
        monkeypatch,
        apple_jwks,
        make_id_token(apple_jwks, nonce, email_verified="false"),
    )
    res = _apple_post_callback(client, params["state"][0], nonce)

    assert res.status_code == 302
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "code" not in query
    assert "not verified" in query["error"][0].lower()


def test_apple_callback_refuses_to_take_over_password_account(
    client, apple_enabled, apple_jwks, monkeypatch
):
    """A password account sharing the address is not silently converted."""
    email = f"apple-takeover-{uuid.uuid4().hex[:8]}@example.com"
    assert (
        client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": "password123", "full_name": "Local"},
        ).status_code
        == 201
    )

    params = _apple_start(client)
    nonce = params["nonce"][0]
    install_apple_network(
        monkeypatch, apple_jwks, make_id_token(apple_jwks, nonce, sub="sub-takeover", email=email)
    )
    res = _apple_post_callback(client, params["state"][0], nonce)
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "code" not in query
    assert "already exists" in query["error"][0]

    # The original password account still works.
    assert (
        client.post("/api/v1/auth/login", json={"email": email, "password": "password123"}).status_code
        == 200
    )


def test_apple_callback_rejects_nonce_that_does_not_match_state(
    client, apple_enabled, apple_jwks, monkeypatch
):
    params = _apple_start(client)
    # Apple signs a different nonce than the one this server issued.
    install_apple_network(monkeypatch, apple_jwks, make_id_token(apple_jwks, "attacker-nonce"))

    res = _apple_post_callback(client, params["state"][0], params["nonce"][0])
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "code" not in query
    assert "could not be verified" in query["error"][0]


def test_apple_callback_rejects_tampered_state(client, apple_enabled, apple_jwks, monkeypatch):
    params = _apple_start(client)
    nonce = params["nonce"][0]
    install_apple_network(monkeypatch, apple_jwks, make_id_token(apple_jwks, nonce))

    state = params["state"][0]
    tampered = state[:-4] + ("aaaa" if not state.endswith("aaaa") else "bbbb")
    res = _apple_post_callback(client, tampered, nonce)
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "code" not in query
    assert "error" in query


def test_apple_callback_rejects_provider_mismatch(client, apple_enabled, apple_jwks, monkeypatch):
    params = _apple_start(client)
    nonce = params["nonce"][0]
    install_apple_network(monkeypatch, apple_jwks, make_id_token(apple_jwks, nonce))

    res = client.post(
        "/api/v1/auth/oauth/google/callback",
        data={"code": "apple-auth-code", "state": params["state"][0]},
        follow_redirects=False,
    )
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "code" not in query
    assert "error" in query


def test_apple_callback_reports_apple_token_rejection(client, apple_enabled, apple_jwks, monkeypatch):
    params = _apple_start(client)
    install_apple_network(monkeypatch, apple_jwks, "", token_status=400)

    res = _apple_post_callback(client, params["state"][0], params["nonce"][0])
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "code" not in query
    assert "Apple rejected" in query["error"][0]


def test_apple_callback_reports_cancellation(client, apple_enabled):
    res = client.post(
        "/api/v1/auth/oauth/apple/callback",
        data={"error": "user_cancelled_authorize"},
        follow_redirects=False,
    )
    query = parse_qs(urlparse(res.headers["location"]).query)
    assert "cancelled" in query["error"][0].lower()


def test_apple_account_cannot_use_password_login(client, apple_enabled, apple_jwks, monkeypatch):
    email = f"apple-nowordpass-{uuid.uuid4().hex[:8]}@example.com"
    params = _apple_start(client)
    nonce = params["nonce"][0]
    install_apple_network(
        monkeypatch, apple_jwks, make_id_token(apple_jwks, nonce, sub="sub-nopass", email=email)
    )
    res = _apple_post_callback(client, params["state"][0], nonce)
    code = parse_qs(urlparse(res.headers["location"]).query)["code"][0]
    client.post("/api/v1/auth/oauth/exchange", json={"code": code})

    login = client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
    assert login.status_code == 400
    assert "Apple" in login.json()["detail"]


def test_providers_list_includes_apple(client, apple_enabled):
    res = client.get("/api/v1/auth/oauth/providers")
    assert res.json()["providers"] == {"apple": "Apple"}


def test_apple_start_404_when_unconfigured(client):
    res = client.get("/api/v1/auth/oauth/apple/start", follow_redirects=False)
    assert res.status_code == 404
