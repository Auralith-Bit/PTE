"""Google, Facebook and Apple sign-in (OAuth 2.0 authorization code flow).

Flow
----
1. ``GET /auth/oauth/{provider}/start`` signs a short-lived state token holding
   the PKCE verifier, a CSRF nonce and the post-login path, then 302s to the
   provider's consent screen. The CSRF nonce is mirrored into an HttpOnly cookie.
2. The provider redirects back to ``/auth/oauth/{provider}/callback``. The state
   token is verified, the CSRF nonce is compared against the cookie, and the code
   is exchanged for a provider access token. Apple is the exception: it requires
   ``response_mode=form_post``, so it POSTs to the same path and cannot replay the
   SameSite=Lax cookie. Apple therefore binds its nonce into the signed id_token
   instead, which ``services.apple`` verifies.
3. The provider identity is read, the local user is created or refreshed, and an
   opaque single-use code is issued for the frontend to exchange for a real token
   pair (see ``app.core.oauth_codes``).

A provider is only enabled when the credentials it needs are configured, so a
half-finished setup degrades to "no button" instead of a broken sign-in.
"""
import base64
import hashlib
import json
import logging
import secrets
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any
from urllib.parse import urlencode

import httpx
import jwt
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User
from app.services import apple as apple_service

log = logging.getLogger("app.oauth")

STATE_TOKEN_TYPE = "oauth_state"
HTTP_TIMEOUT_SECONDS = 10.0
GRAPH_VERSION = "v21.0"


class OAuthError(Exception):
    """A sign-in attempt failed. The message is safe to show to the user."""


@dataclass(frozen=True)
class OAuthProviderConfig:
    name: str
    display_name: str
    client_id: str
    client_secret: str
    authorize_url: str
    token_url: str
    token_method: str
    userinfo_url: str
    scope: str
    # Apple rejects PKCE parameters and requires a form POST for the callback.
    supports_pkce: bool = True
    response_mode: str | None = None
    uses_form_post: bool = False


def _google() -> OAuthProviderConfig | None:
    if not (settings.google_client_id and settings.google_client_secret):
        return None
    return OAuthProviderConfig(
        name="google",
        display_name="Google",
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        authorize_url="https://accounts.google.com/o/oauth2/v2/auth",
        token_url="https://oauth2.googleapis.com/token",
        token_method="POST",
        userinfo_url="https://openidconnect.googleapis.com/v1/userinfo",
        scope="openid email profile",
    )


def _facebook() -> OAuthProviderConfig | None:
    if not (settings.facebook_client_id and settings.facebook_client_secret):
        return None
    graph = f"https://graph.facebook.com/{GRAPH_VERSION}"
    return OAuthProviderConfig(
        name="facebook",
        display_name="Facebook",
        client_id=settings.facebook_client_id,
        client_secret=settings.facebook_client_secret,
        authorize_url=f"{graph}/dialog/oauth",
        token_url=f"{graph}/oauth/access_token",
        token_method="GET",
        userinfo_url=f"{graph}/me?fields=id,name,email,picture.type(large)",
        scope="email public_profile",
    )


def _apple() -> OAuthProviderConfig | None:
    if not apple_service.enabled():
        return None
    return OAuthProviderConfig(
        name="apple",
        display_name="Apple",
        client_id=settings.apple_client_id or "",
        # Never used directly: the secret is minted per request in services.apple.
        client_secret="",
        authorize_url=apple_service.AUTHORIZE_URL,
        token_url=apple_service.TOKEN_URL,
        token_method="POST",
        userinfo_url="",
        scope=apple_service.SCOPE,
        supports_pkce=False,
        response_mode=apple_service.RESPONSE_MODE,
        uses_form_post=True,
    )


def _provider_factories() -> dict[str, Any]:
    return {"google": _google, "facebook": _facebook, "apple": _apple}


def get_provider(name: str) -> OAuthProviderConfig:
    config = _provider_factories().get(name, lambda: None)()
    if config is None:
        raise OAuthError(f"{name.title()} sign-in is not configured on this server.")
    return config


def enabled_providers() -> dict[str, str]:
    """Map of provider name -> display name, for providers that are ready to use."""
    available = {name: factory() for name, factory in _provider_factories().items()}
    return {name: conf.display_name for name, conf in available.items() if conf is not None}


def callback_uri(provider: str) -> str:
    base = settings.backend_public_url.rstrip("/")
    return f"{base}/api/v1/auth/oauth/{provider}/callback"


def frontend_callback_url() -> str:
    return f"{settings.frontend_url.rstrip('/')}/auth/callback"


def safe_next_path(value: str | None) -> str:
    """Keep post-login redirects on this site: relative paths only."""
    if not value or not value.startswith("/") or value.startswith("//"):
        return "/dashboard"
    return value


def pkce_pair() -> tuple[str, str]:
    """Return (code_verifier, code_challenge) for S256."""
    verifier = secrets.token_urlsafe(64)
    challenge = (
        base64.urlsafe_b64encode(hashlib.sha256(verifier.encode("ascii")).digest())
        .rstrip(b"=")
        .decode("ascii")
    )
    return verifier, challenge


def new_csrf_nonce() -> str:
    return secrets.token_urlsafe(24)


def create_state_token(provider: str, next_path: str, verifier: str, csrf_nonce: str) -> str:
    now = datetime.now(UTC)
    payload: dict[str, Any] = {
        "type": STATE_TOKEN_TYPE,
        "provider": provider,
        "next": next_path,
        "verifier": verifier,
        "csrf": csrf_nonce,
        "iat": now,
        "exp": now + timedelta(seconds=settings.oauth_state_ttl_seconds),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def read_state_token(state: str) -> dict[str, Any]:
    try:
        payload: dict[str, Any] = jwt.decode(
            state, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
    except jwt.PyJWTError:
        raise OAuthError("Your sign-in request expired or was tampered with. Please try again.") from None
    if payload.get("type") != STATE_TOKEN_TYPE:
        raise OAuthError("Your sign-in request expired or was tampered with. Please try again.")
    return payload


def build_authorize_url(
    config: OAuthProviderConfig, state: str, code_challenge: str, nonce: str
) -> str:
    params: dict[str, str] = {
        "client_id": config.client_id,
        "redirect_uri": callback_uri(config.name),
        "response_type": "code",
        "scope": config.scope,
        "state": state,
    }
    if config.supports_pkce:
        params["code_challenge"] = code_challenge
        params["code_challenge_method"] = "S256"
    if config.response_mode:
        params["response_mode"] = config.response_mode
    if config.name == "google":
        params["access_type"] = "online"
        params["prompt"] = "select_account"
    if config.name == "apple":
        # Apple echoes this back inside the id_token, which is how the form POST
        # callback is tied to this flow in place of the CSRF cookie.
        params["nonce"] = nonce
    return f"{config.authorize_url}?{urlencode(params)}"


@dataclass(frozen=True)
class ProviderIdentity:
    provider_user_id: str
    email: str
    full_name: str | None
    avatar_url: str | None


@dataclass(frozen=True)
class ProviderTokenResponse:
    """Whatever the token endpoint returned.

    Apple puts the identity in ``id_token`` and has no userinfo endpoint, so the
    raw body is kept rather than collapsing it to a bare access token.
    """

    access_token: str
    id_token: str | None = None
    raw: dict[str, Any] | None = None


def _require_email(info: dict[str, Any], display_name: str) -> str:
    email = info.get("email")
    if not email:
        raise OAuthError(f"{display_name} did not share your email address, so we cannot sign you in.")
    if not info.get("email_verified", True):
        raise OAuthError("Your email address is not verified. Verify it with your provider first.")
    return str(email).strip().lower()


async def fetch_token(
    config: OAuthProviderConfig, code: str, verifier: str, nonce: str
) -> ProviderTokenResponse:
    """Trade the authorization code for the provider's token response."""
    if config.name == "apple":
        # Apple mints its own ES256 client secret and has no PKCE, so the shared
        # request below cannot be used; services.apple performs the exchange.
        try:
            body = await apple_service.exchange_code(code, callback_uri(config.name))
        except apple_service.AppleError as exc:
            raise OAuthError(str(exc)) from None
        return ProviderTokenResponse(
            access_token=str(body.get("access_token") or ""),
            id_token=body.get("id_token"),
            raw=body,
        )

    params = {
        "code": code,
        "client_id": config.client_id,
        "client_secret": config.client_secret,
        "redirect_uri": callback_uri(config.name),
        "code_verifier": verifier,
    }
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_SECONDS) as client:
            if config.token_method == "GET":
                response = await client.get(config.token_url, params=params)
            else:
                response = await client.post(
                    config.token_url,
                    data={**params, "grant_type": "authorization_code"},
                )
    except httpx.HTTPError:
        log.warning("OAuth token request to %s failed", config.name, exc_info=True)
        raise OAuthError(f"Could not reach {config.display_name}. Please try again.") from None

    if response.status_code >= 400:
        log.warning(
            "OAuth token request to %s returned %s: %s",
            config.name,
            response.status_code,
            response.text[:300],
        )
        raise OAuthError(f"{config.display_name} rejected the sign-in. Please try again.")

    try:
        body = response.json()
    except ValueError:
        raise OAuthError(f"Unexpected response from {config.display_name}.") from None

    access_token = body.get("access_token")
    if not access_token:
        raise OAuthError(f"{config.display_name} did not return an access token.")
    return ProviderTokenResponse(access_token=str(access_token), raw=body)


def _apple_name(user_field: str | None) -> str | None:
    """Apple sends the name once, as a JSON blob in the form POST body."""
    if not user_field:
        return None
    try:
        name = json.loads(user_field).get("name", {})
    except (TypeError, ValueError):
        return None
    parts = [str(name.get(key) or "").strip() for key in ("firstName", "lastName")]
    full_name = " ".join(part for part in parts if part)
    return full_name or None


async def fetch_identity(
    config: OAuthProviderConfig, tokens: ProviderTokenResponse, nonce: str, user_field: str | None = None
) -> ProviderIdentity:
    """Read the signed-in user's profile from the provider."""
    if config.name == "apple":
        if not tokens.id_token:
            raise OAuthError("Apple did not return an identity token.")
        try:
            claims = await apple_service.verify_id_token(tokens.id_token, nonce)
        except apple_service.AppleError as exc:
            raise OAuthError(str(exc)) from None

        subject = claims.get("sub")
        if not subject:
            raise OAuthError("Apple did not return an account id.")
        email = claims.get("email")
        if not email:
            # Apple only shares the email on the first authorization, so a missing
            # one here only affects a user we have never seen before.
            raise OAuthError("Apple did not share your email address, so we cannot sign you in.")
        if not apple_service._email_is_verified(claims.get("email_verified", True)):
            raise OAuthError("Your email address is not verified. Verify it with Apple first.")

        return ProviderIdentity(
            provider_user_id=str(subject),
            email=str(email).strip().lower(),
            full_name=_apple_name(user_field),
            avatar_url=None,
        )

    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_SECONDS) as client:
            if config.name == "facebook":
                response = await client.get(
                    config.userinfo_url, params={"access_token": tokens.access_token}
                )
            else:
                response = await client.get(
                    config.userinfo_url,
                    headers={"Authorization": f"Bearer {tokens.access_token}"},
                )
    except httpx.HTTPError:
        log.warning("OAuth userinfo request to %s failed", config.name, exc_info=True)
        raise OAuthError(f"Could not reach {config.display_name}. Please try again.") from None

    if response.status_code >= 400:
        log.warning(
            "OAuth userinfo request to %s returned %s", config.name, response.status_code
        )
        raise OAuthError(f"{config.display_name} could not confirm your account details.")

    try:
        info = response.json()
    except ValueError:
        raise OAuthError(f"Unexpected response from {config.display_name}.") from None

    raw_id = info.get("sub") or info.get("id")
    if not raw_id:
        raise OAuthError(f"{config.display_name} did not return an account id.")

    avatar = info.get("picture")
    if isinstance(avatar, dict):
        avatar = avatar.get("data", {}).get("url")

    return ProviderIdentity(
        provider_user_id=str(raw_id),
        email=_require_email(info, config.display_name),
        full_name=(info.get("name") or None),
        avatar_url=(str(avatar) if avatar else None),
    )


def upsert_oauth_user(db: Session, config: OAuthProviderConfig, identity: ProviderIdentity) -> User:
    """Find or create the local account for a provider identity.

    An existing email/password account is never silently converted into an OAuth
    account: that would let anyone who controls the address at the provider take
    over a local account. The user is told to sign in with their password instead.
    """
    user = db.scalar(
        select(User).where(
            User.auth_provider == config.name,
            User.provider_user_id == identity.provider_user_id,
        )
    )
    if user is not None:
        if identity.full_name and not user.full_name:
            user.full_name = identity.full_name
        if identity.avatar_url and not user.avatar_url:
            user.avatar_url = identity.avatar_url
        db.commit()
        db.refresh(user)
        log.info("OAuth sign-in: existing %s user id=%d", config.name, user.id)
        return user

    existing = db.scalar(select(User).where(User.email == identity.email))
    if existing is not None:
        raise OAuthError(
            f"An account with {identity.email} already exists. Please sign in with your password."
        )

    user = User(
        email=identity.email,
        full_name=identity.full_name,
        password_hash=None,
        auth_provider=config.name,
        provider_user_id=identity.provider_user_id,
        avatar_url=identity.avatar_url,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    log.info("OAuth sign-in: created %s user id=%d", config.name, user.id)
    return user
