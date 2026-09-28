from datetime import datetime

from sqlalchemy import DateTime, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.time_utils import utcnow
from app.db.base import Base

PASSWORD_PROVIDER = "password"


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("auth_provider", "provider_user_id", name="uq_users_provider_identity"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    # NULL for accounts that only ever signed in through an OAuth provider.
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    # OAuth identity. auth_provider is "password" for email/password accounts.
    auth_provider: Mapped[str] = mapped_column(
        String(32), default=PASSWORD_PROVIDER, nullable=False, index=True
    )
    provider_user_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    @property
    def is_password_account(self) -> bool:
        return self.auth_provider == PASSWORD_PROVIDER and self.password_hash is not None

