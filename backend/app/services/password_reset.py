"""Password-reset request handling.

Security properties, in order of importance:

* The request endpoint always answers the same way whether or not the address is
  registered, so it cannot be used to discover which emails have accounts.
* Reset tokens are random, stored only as a SHA-256 hash, expire, and are
  single-use.
* Issuing a new token supersedes any earlier unused one for that account.
* Completing a reset bumps ``users.token_version``, which invalidates every
  access and refresh token issued before it, so a stolen session dies with the
  old password.
* Accounts that only sign in through an OAuth provider are skipped, because they
  have no password to reset.
"""
import hashlib
import logging
import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.services import mailer

log = logging.getLogger("app.password_reset")

TOKEN_BYTES = 32
# Answered to the caller regardless of what actually happened.
GENERIC_MESSAGE = (
    "If an account exists for that email and uses a password, a reset link is on its way."
)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def reset_url_for(token: str) -> str:
    base = settings.frontend_url.rstrip("/")
    return f"{base}/reset-password?token={token}"


def _supersede_active(db: Session, user_id: int, now: datetime) -> None:
    db.execute(
        update(PasswordResetToken)
        .where(
            PasswordResetToken.user_id == user_id,
            PasswordResetToken.used_at.is_(None),
        )
        .values(used_at=now)
    )


def create_reset(db: Session, email: str) -> bool:
    """Start a reset. Returns True if a link was actually generated.

    The caller must not use this return value to shape its response, or the
    endpoint starts leaking which emails exist.
    """
    now = datetime.now(UTC)
    user = db.scalar(select(User).where(User.email == email.strip().lower()))

    if user is None:
        log.info("Password reset requested for unknown address %s", email)
        return False

    if user.password_hash is None:
        log.info("Password reset requested for %s-only account id=%d", user.auth_provider, user.id)
        return False

    raw_token = secrets.token_urlsafe(TOKEN_BYTES)
    db.add(
        PasswordResetToken(
            user_id=user.id,
            token_hash=hash_token(raw_token),
            expires_at=now + timedelta(minutes=settings.password_reset_ttl_minutes),
        )
    )
    _supersede_active(db, user.id, now)
    db.commit()

    mailer.send_password_reset(user.email, reset_url_for(raw_token))
    log.info("Password reset token issued for user id=%d", user.id)
    return True


def complete_reset(db: Session, token: str, new_password: str) -> User:
    """Redeem a reset token and set the new password.

    Raises ValueError with a user-safe message when the token cannot be used.
    """
    invalid = ValueError("This reset link is invalid or has expired. Please request a new one.")

    now = datetime.now(UTC)
    record = db.scalar(
        select(PasswordResetToken).where(PasswordResetToken.token_hash == hash_token(token))
    )
    if record is None or not record.is_usable(now):
        raise invalid

    user = db.get(User, record.user_id)
    if user is None:
        raise invalid

    user.password_hash = hash_password(new_password)
    # An OAuth-only account becomes a password account once a password is set.
    if user.auth_provider != "password":
        user.auth_provider = "password"
    user.token_version += 1

    record.used_at = now
    db.commit()
    db.refresh(user)

    log.info("Password reset completed for user id=%d; old sessions invalidated", user.id)
    return user
