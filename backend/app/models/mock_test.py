from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.time_utils import utcnow
from app.db.base import Base


class MockTest(Base):
    __tablename__ = "mock_tests"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # "full_length" or "section"
    kind: Mapped[str] = mapped_column(String(20), nullable=False)
    # only set when kind == "section"
    category: Mapped[str | None] = mapped_column(String(20), nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )


class MockAttempt(Base):
    __tablename__ = "mock_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    mock_test_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("mock_tests.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(20), default="in_progress", nullable=False)
    # Snapshot of the questions presented to the user at start time.
    # List of {id, category, type, title, instructions, content} with answers stripped.
    questions: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    # question_id -> answer dict, populated as the user answers.
    answers: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    # question_id -> {score, max_score, correct}
    results: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    total_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    max_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
