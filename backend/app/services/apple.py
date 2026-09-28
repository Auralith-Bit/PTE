"""Sign in with Apple.

Apple differs from the other providers in three ways, all of which are handled
here so the shared flow in ``app.services.oauth`` stays provider agnostic:

* The client secret is not a fixed string. It is a short-lived ES256 JWT signed
  with the private key downloaded from the Apple Developer portal, so it is
  minted per request rather than read from config.
* There is no userinfo endpoint. The identity arrives inside ``id_token``, a
  JWT signed with one of Apple's rotating RS256 keys, and has to be verified
  against Apple's published JWKS.
* Apple only returns the user's name on the very first authorization, and it
  demands ``response_mode=form_post`` whenever a scope is requested. The
  therefore arrives as a POST to the callback rather than a redirect with query
  parameters, which also means the browser will not replay the SameSite=Lax CSRF
  cookie. That is why the nonce is bound into the id_token and checked in
  ``verify_id_token`` instead: Apple echoes it back inside a signature it made
  itself, which is at least as strong a binding as the cookie.
"""
import logging
import time
from pathlib import Path
from typing import Any

import httpx
import jwt

from app.core.config import settings

log = logging.getLogger("app.oauth.apple")

AUTHORIZE_URL = "https://appleid.apple.com/auth/authorize"
TOKEN_URL = "https://appleid.apple.com/auth/oauth2/token"
JWKS_URL = "https://appleid.apple.com/auth/keys"
ISSUER = "https://appleid.apple.com"
SCOPE = "name email"
RESPONSE_MODE = "form_post"

HTTP_TIMEOUT_SECONDS = 10.0
# Apple rotates signing keys rarely; an hour is a sane cache window and the cache
# is bypassed immediately when a token's `kid` is not the one we hold.
JWKS_CACHE_SECONDS = 3600

_jwks_cache: dict[str, Any] = {"fetched_at": 0.0, "keys": {}}


class AppleError(Exception):
    """An Apple sign-in attempt failed. The message is safe to show to a user."""


def enabled() -> bool:
    """Apple is ready when a client id and a usable client secret are available."""
    if not settings.apple_client_id:
        return False
    if settings.apple_client_secret:
        return True
    return bool(
        settings.apple_team_id
        and settings.apple_key_id
        and (settings.apple_private_key or settings.apple_private_key_path)
    )


def accepted_audiences() -> list[str]:
    """The Services ID plus any extra audiences, e.g. a native iOS bundle id."""
    audiences = [settings.apple_client_id or ""]
    for extra in (settings.apple_audiences or "").split(","):
        cleaned = extra.strip()
        if cleaned and cleaned not in audiences:
            audiences.append(cleaned)
    return [a for a in audiences if a]


def _private_key_pem() -> str:
    """Read the .p8 signing key from config or disk."""
    if settings.apple_private_key:
        # Lets the key be supplied as a single .env line.
        return settings.apple_private_key.replace("\\n", "\n")
    path = settings.apple_private_key_path
    if not path:
        raise AppleError("Sign in with Apple is not configured on this server.")
    try:
        return Path(path).read_text(encoding="utf-8")
    except OSError:
        log.exception("Could not read the Apple private key at %s", path)
        raise AppleError("Sign in with Apple is not configured on this server.") from None


def client_secret() -> str:
    """Mint the ES256 client secret Apple expects on the token request."""
    if settings.apple_client_secret:
        return settings.apple_client_secret

    ttl_days = min(max(settings.apple_client_secret_ttl_days, 1), 180)
    now = int(time.time())
    try:
        return jwt.encode(
            {
                "iss": settings.apple_team_id,
                "iat": now,
                "exp": now + ttl_days * 24 * 60 * 60,
                "aud": ISSUER,
                "sub": settings.apple_client_id,
            },
            _private_key_pem(),
            algorithm="ES256",
            headers={"kid": settings.apple_key_id},
        )
    except (jwt.PyJWTError, ValueError):
        log.exception("Could not build the Apple client secret")
        raise AppleError("Sign in with Apple is not configured on this server.") from None


async def _load_signing_key(kid: str | None) -> Any:
    """Return Apple's public key for `kid`, refreshing the cached JWKS if needed."""
    now = time.monotonic()
    keys: dict[str, Any] = {}
    if now - _jwks_cache["fetched_at"] < JWKS_CACHE_SECONDS:
        keys = _jwks_cache["keys"]

    if kid and kid in keys:
        return keys[kid]

    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_SECONDS) as client:
            response = await client.get(JWKS_URL)
    except httpx.HTTPError:
        log.warning("Could not reach Apple's JWKS endpoint", exc_info=True)
        raise AppleError("Could not reach Apple. Please try again.") from None

    if response.status_code >= 400:
        log.warning("Apple JWKS request returned %s", response.status_code)
        raise AppleError("Could not reach Apple. Please try again.")

    try:
        published = response.json().get("keys", [])
    except ValueError:
        raise AppleError("Unexpected response from Apple.") from None

    keys = {}
    for jwk in published:
        kid_value = jwk.get("kid")
        if not kid_value:
            continue
        try:
            # Apple only ever signs with RS256, so the algorithm is pinned rather
            # than trusted from the document.
            keys[str(kid_value)] = jwt.PyJWK.from_dict(jwk, algorithm="RS256").key
        except (KeyError, ValueError, jwt.PyJWTError):
            log.warning("Skipping unusable Apple JWK: %s", jwk.get("kid"))
    if not keys:
        raise AppleError("Apple returned no usable signing keys.")

    _jwks_cache["keys"] = keys
    _jwks_cache["fetched_at"] = now

    if kid and kid not in keys:
        log.warning("Apple id_token references unknown key id %s", kid)
        raise AppleError("Sign-in could not be verified. Please try again.")
    return keys.get(kid) or next(iter(keys.values()))


def _email_is_verified(value: Any) -> bool:
    """Apple sends this as a JSON string ("true"/"false") rather than a boolean."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"true", "yes", "1"}
    return False


async def exchange_code(code: str, redirect_uri: str) -> dict[str, Any]:
    """Trade the authorization code for Apple's token response, including id_token."""
    try:
        async with httpx.AsyncClient(timeout=HTTP_TIMEOUT_SECONDS) as client:
            response = await client.post(
                TOKEN_URL,
                data={
                    "client_id": settings.apple_client_id or "",
                    "client_secret": client_secret(),
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri,
                },
            )
    except httpx.HTTPError:
        log.warning("Apple token request failed", exc_info=True)
        raise AppleError("Could not reach Apple. Please try again.") from None

    if response.status_code >= 400:
        log.warning("Apple token request returned %s: %s", response.status_code, response.text[:300])
        raise AppleError("Apple rejected the sign-in. Please try again.")

    try:
        body = response.json()
    except ValueError:
        raise AppleError("Unexpected response from Apple.") from None

    if not body.get("id_token"):
        raise AppleError("Apple did not return an identity token.")
    return body


async def verify_id_token(id_token: str, expected_nonce: str | None) -> dict[str, Any]:
    """Verify Apple's signed id_token and return its claims."""
    try:
        kid = jwt.get_unverified_header(id_token).get("kid")
    except jwt.PyJWTError:
        raise AppleError("Sign-in could not be verified. Please try again.") from None

    key = await _load_signing_key(kid)
    try:
        claims = jwt.decode(
            id_token,
            key=key,
            algorithms=["RS256"],
            audience=accepted_audiences(),
            issuer=ISSUER,
        )
    except jwt.PyJWTError:
        log.warning("Apple id_token failed verification", exc_info=True)
        raise AppleError("Sign-in could not be verified. Please try again.") from None

    # Apple's own signature already binds the nonce, so this proves the response
    # belongs to the flow this server started.
    if expected_nonce and claims.get("nonce") != expected_nonce:
        log.warning("Apple id_token nonce did not match the request")
        raise AppleError("Sign-in could not be verified. Please try again.")

    return claims
