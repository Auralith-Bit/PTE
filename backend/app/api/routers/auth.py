import logging
import secrets
from urllib.parse import urlencode

import jwt
from fastapi import APIRouter, Cookie, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core import oauth_codes
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    ChangePassword,
    ForgotPasswordRequest,
    OAuthExchange,
    OAuthExchangeResult,
    OAuthProvidersOut,
    RefreshRequest,
    ResetPasswordRequest,
    TokenPair,
    UserLogin,
    UserOut,
    UserRegister,
)
from app.services import oauth
from app.services.password_reset import GENERIC_MESSAGE, complete_reset, create_reset

log = logging.getLogger("app.auth")

router = APIRouter(prefix="/auth", tags=["auth"])

OAUTH_CSRF_COOKIE = "pte_oauth_csrf"
OAUTH_COOKIE_PATH = "/api/v1/auth/oauth"


def _get_user_or_404(db: Session, email: str) -> User:
    user = db.scalar(select(User).where(User.email == email.lower()))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user


def _token_pair(user: User) -> TokenPair:
    return TokenPair(
        access_token=create_access_token(user.id, user.token_version),
        refresh_token=create_refresh_token(user.id, user.token_version),
    )


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)) -> User:
    email = payload.email.lower()
    existing = db.scalar(select(User).where(User.email == email))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(email=email, full_name=payload.full_name, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    log.info("User registered: %s (id=%d)", email, user.id)
    return user


@router.post("/login", response_model=TokenPair)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenPair:
    user = _get_user_or_404(db, payload.email)
    if user.password_hash is None:
        log.info("Password login attempted for OAuth-only account: %s", payload.email)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This account signs in with {user.auth_provider.title()}. Use that button to continue.",
        )
    if not verify_password(payload.password, user.password_hash):
        log.warning("Failed login attempt for %s", payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    log.info("User logged in: %s (id=%d)", payload.email, user.id)
    return _token_pair(user)


@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)) -> TokenPair:
    try:
        data = decode_token(payload.refresh_token, expected_type="refresh")
    except jwt.PyJWTError:
        detail = "Invalid refresh token"
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail) from None

    user = db.get(User, int(data["sub"]))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    if data.get("ver", 0) != user.token_version:
        log.info("Refusing stale refresh token for user id=%d", user.id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )
    return _token_pair(user)


@router.get("/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user)) -> User:
    return user


@router.post("/change-password")
def change_password(
    payload: ChangePassword,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    if user.password_hash is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This account signs in with {user.auth_provider.title()} and has no password to change.",
        )
    if payload.current_password is not None and not verify_password(
        payload.current_password, user.password_hash
    ):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if verify_password(payload.new_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password",
        )
    user.password_hash = hash_password(payload.new_password)
    user.token_version += 1
    db.commit()
    log.info("Password changed for user id=%d", user.id)
    return {"message": "Password changed successfully"}


@router.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> dict:
    """Always the same answer, so this cannot be used to enumerate accounts."""
    create_reset(db, payload.email)
    return {"message": GENERIC_MESSAGE}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> dict:
    try:
        complete_reset(db, payload.token, payload.new_password)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from None
    return {"message": "Your password has been reset. You can sign in now."}


def _frontend_error(message: str) -> RedirectResponse:
    return RedirectResponse(
        url=f"{oauth.frontend_callback_url()}?error={urlencode({'error': message})}",
        status_code=status.HTTP_302_FOUND,
    )


@router.get("/oauth/providers", response_model=OAuthProvidersOut)
def oauth_providers() -> OAuthProvidersOut:
    """Which provider buttons the frontend should render."""
    return OAuthProvidersOut(providers=oauth.enabled_providers())


@router.get("/oauth/{provider}/start")
def oauth_start(
    provider: str,
    next_path: str = Query(default="/dashboard", alias="next"),
) -> RedirectResponse:
    try:
        config = oauth.get_provider(provider)
    except oauth.OAuthError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from None

    verifier, challenge = oauth.pkce_pair()
    csrf_nonce = oauth.new_csrf_nonce()
    state = oauth.create_state_token(
        provider, oauth.safe_next_path(next_path), verifier, csrf_nonce
    )
    response = RedirectResponse(
        url=oauth.build_authorize_url(config, state, challenge, csrf_nonce),
        status_code=status.HTTP_302_FOUND,
    )
    response.set_cookie(
        key=OAUTH_CSRF_COOKIE,
        value=csrf_nonce,
        max_age=settings.oauth_state_ttl_seconds,
        path=OAUTH_COOKIE_PATH,
        httponly=True,
        samesite="lax",
        secure=settings.backend_public_url.startswith("https://"),
    )
    return response


async def _finish_oauth(
    provider: str,
    code: str | None,
    state: str | None,
    error: str | None,
    csrf_cookie: str | None,
    db: Session,
    *,
    via_form_post: bool,
    user_field: str | None = None,
) -> RedirectResponse:
    """Shared tail of the OAuth callback for both the GET and form POST routes."""
    if error:
        log.info("OAuth callback from %s returned error: %s", provider, error)
        return _frontend_error("Sign-in was cancelled.")

    try:
        config = oauth.get_provider(provider)
    except oauth.OAuthError as exc:
        return _frontend_error(str(exc))

    if not code or not state:
        return _frontend_error("Sign-in could not be completed. Please try again.")

    try:
        payload = oauth.read_state_token(state)
        if payload.get("provider") != provider:
            return _frontend_error("Sign-in could not be completed. Please try again.")

        # A SameSite=Lax cookie is only replayed on top-level GET navigations, so a
        # form POST (Apple) never carries it. Apple instead proves the response
        # belongs to this flow by echoing the nonce into its signed id_token, which
        # fetch_identity checks below. Only the provider that actually needs this
        # gets the exemption; every other provider still requires the cookie, so this
        # route cannot be used to dodge the CSRF check on Google or Facebook.
        if not via_form_post or not config.uses_form_post:
            if not csrf_cookie or not secrets.compare_digest(
                str(payload.get("csrf", "")), csrf_cookie
            ):
                log.warning("OAuth callback for %s failed CSRF check", provider)
                return _frontend_error("Sign-in could not be verified. Please try again.")

        next_path = oauth.safe_next_path(payload.get("next"))
        nonce = str(payload.get("csrf", ""))
        verifier = str(payload.get("verifier", ""))
        if not nonce or (config.supports_pkce and not verifier):
            return _frontend_error("Sign-in could not be completed. Please try again.")

        tokens = await oauth.fetch_token(config, code, verifier, nonce)
        identity = await oauth.fetch_identity(config, tokens, nonce, user_field)
        user = oauth.upsert_oauth_user(db, config, identity)
    except oauth.OAuthError as exc:
        log.info("OAuth callback for %s failed: %s", provider, exc)
        return _frontend_error(str(exc))

    exchange_code = oauth_codes.issue_code(user.id, next_path, settings.oauth_code_ttl_seconds)
    response = RedirectResponse(
        url=f"{oauth.frontend_callback_url()}?{urlencode({'code': exchange_code})}",
        status_code=status.HTTP_302_FOUND,
    )
    response.delete_cookie(key=OAUTH_CSRF_COOKIE, path=OAUTH_COOKIE_PATH)
    return response


@router.get("/oauth/{provider}/callback")
async def oauth_callback(
    provider: str,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    csrf_cookie: str | None = Cookie(default=None, alias=OAUTH_CSRF_COOKIE),
    db: Session = Depends(get_db),
) -> RedirectResponse:
    return await _finish_oauth(
        provider, code, state, error, csrf_cookie, db, via_form_post=False
    )


@router.post("/oauth/{provider}/callback")
async def oauth_callback_form_post(
    provider: str,
    request: Request,
    csrf_cookie: str | None = Cookie(default=None, alias=OAUTH_CSRF_COOKIE),
    db: Session = Depends(get_db),
) -> RedirectResponse:
    """Apple's callback. It insists on form POST whenever a scope is requested."""
    form = await request.form()

    def field(name: str) -> str | None:
        value = form.get(name)
        return str(value) if value is not None else None

    return await _finish_oauth(
        provider,
        field("code"),
        field("state"),
        field("error"),
        csrf_cookie,
        db,
        via_form_post=True,
        # Apple only sends the user's name on the very first authorization.
        user_field=field("user"),
    )


@router.post("/oauth/exchange", response_model=OAuthExchangeResult)
def oauth_exchange(payload: OAuthExchange, db: Session = Depends(get_db)) -> OAuthExchangeResult:
    entry = oauth_codes.consume_code(payload.code)
    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sign-in link expired. Please try again.",
        )

    user = db.get(User, entry.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign-in link expired")

    tokens = _token_pair(user)
    log.info("OAuth session established for user id=%d (%s)", user.id, user.auth_provider)
    return OAuthExchangeResult(
        access_token=tokens.access_token,
        refresh_token=tokens.refresh_token,
        expires_in=tokens.expires_in,
        user=UserOut.model_validate(user),
        next=oauth.safe_next_path(entry.next_path),
    )
