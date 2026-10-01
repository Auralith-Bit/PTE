from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.time_utils import utcnow
from app.db.base import Base


class Notification(Base):
    """A user-facing alert, rendered in the dashboard navbar bell.

    Rows are user-scoped: every query that touches this table filters on
    user_id, so one user can never see or acknowledge another's notifications.
    Deleting a user cascades their notifications away.
    """

    __tablename__ = "notifications"
    __table_args__ = (
        # Serves both the feed (user_id) and the unread-count badge
        # (user_id, is_read) without a separate scan.
        Index("ix_notifications_user_unread", "user_id", "is_read"),
        # The feed is always ordered newest-first by created_at.
        Index("ix_notifications_user_created", "user_id", "created_at"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    # Optional in-app destination. NULL means the notification is informational
    # and is not clickable, so the UI must render it without a link.
    href: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )