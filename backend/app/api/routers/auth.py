import logging

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import ChangePassword, RefreshRequest, TokenPair, UserLogin, UserOut, UserRegister

log = logging.getLogger("app.auth")

router = APIRouter(prefix="/auth", tags=["auth"])


def _get_user_or_404(db: Session, email: str) -> User:
    user = db.scalar(select(User).where(User.email == email.lower()))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user


def _token_pair(user: User) -> TokenPair:
    return TokenPair(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
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
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if verify_password(payload.new_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password",
        )
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    log.info("Password changed for user id=%d", user.id)
    return {"message": "Password changed successfully"}
