import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)

_credentials_error = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise _credentials_error
    try:
        payload = decode_token(credentials.credentials, expected_type="access")
    except jwt.PyJWTError:
        raise _credentials_error from None

    # A correctly signed token can still carry a non-numeric or missing "sub"
    # (a caller minting their own token, or a key reused across services). int()
    # raises outside the decode handler, which turned a bad token into a 500 and
    # a stack trace instead of a 401.
    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        raise _credentials_error from None

    user = db.get(User, user_id)
    if user is None:
        raise _credentials_error
    # A password reset or change bumps token_version, which retires every token
    # issued before it. Tokens predating the claim default to 0.
    if payload.get("ver", 0) != user.token_version:
        raise _credentials_error
    return user
