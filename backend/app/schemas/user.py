from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.config import settings

# bcrypt silently refuses anything past 72 *bytes* and raises, which surfaced as
# a 500 on register / change-password / reset-password. max_length alone cannot
# catch this: 72 characters of non-ASCII is well over 72 bytes.
_BCRYPT_MAX_BYTES = 72


def _reject_oversized_password(value: str) -> str:
    if len(value.encode("utf-8")) > _BCRYPT_MAX_BYTES:
        raise ValueError(
            f"password must be at most {_BCRYPT_MAX_BYTES} bytes when UTF-8 encoded"
        )
    return value


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str | None = Field(default=None, max_length=255)

    _check_password = field_validator("password")(_reject_oversized_password)


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    _check_password = field_validator("password")(_reject_oversized_password)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str | None
    created_at: datetime


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = settings.access_token_expire_minutes * 60


class RefreshRequest(BaseModel):
    refresh_token: str


class ChangePassword(BaseModel):
    current_password: str | None = None
    new_password: str = Field(min_length=8, max_length=128)

    _check_new_password = field_validator("new_password")(_reject_oversized_password)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=20, max_length=200)
    new_password: str = Field(min_length=8, max_length=128)

    _check_new_password = field_validator("new_password")(_reject_oversized_password)


class OAuthProvidersOut(BaseModel):
    providers: dict[str, str] = Field(default_factory=dict)


class OAuthExchange(BaseModel):
    code: str = Field(min_length=10, max_length=200)


class OAuthExchangeResult(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = settings.access_token_expire_minutes * 60
    user: UserOut
    next: str = "/dashboard"
