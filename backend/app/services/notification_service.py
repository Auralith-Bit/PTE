"""Derive notifications from data the user has already generated.

There is no notifications table. Every item here is projected from an existing
row, so a notification cannot exist without a real underlying event, and
deleting the attempt or mock attempt removes the notification with it. The
trade-off is that these are recomputed per request rather than stored, which is
fine at this scale.
"""
from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.attempt import Attempt
from app.models.mock_test import MockAttempt, MockTest
from app.models.question import Question

# Only the recent past is interesting; a student who last practised in March
# should not see a bell badge full of history.
LOOKBACK_DAYS = 30
DEFAULT_LIMIT = 20

_CATEGORY_LABEL = {
    "speaking": "Speaking",
    "writing": "Writing",
    "reading": "Reading",
    "listening": "Listening",
}


def _relative_time(moment: datetime, now: datetime) -> str:
    diff = now - moment
    seconds = diff.total_seconds()
    if seconds < 60:
        return "Just now"
    if seconds < 3600:
        return f"{int(seconds // 60)}m ago"
    if seconds < 86400:
        return f"{int(seconds // 3600)}h ago"
    if seconds < 172800:
        return "Yesterday"
    return f"{int(seconds // 86400)}d ago"


def _score_pct(score: int | None, maximum: int | None) -> int | None:
    if not maximum:
        return None
    return round(100 * (score or 0) / maximum)


def _question_title(db: Session, question_id: int, cache: dict[int, str | None]) -> str | None:
    if question_id in cache:
        return cache[question_id]
    row = db.get(Question, question_id)
    title = row.title if row is not None else None
    cache[question_id] = title
    return title


def build_notifications(db: Session, user_id: int, limit: int = DEFAULT_LIMIT) -> list[dict]:
    """Return the user's notifications, newest first.

    Each item is {id, kind, title, body, time, created_at, read, href}. `id` is
    prefixed by kind so a client can use it as a stable React key and so a mock
    test result can never collide with a practice attempt.
    """
    now = datetime.now(UTC)
    since = now - timedelta(days=LOOKBACK_DAYS)
    items: list[dict] = []

    # 1. Graded practice attempts. The score lands in Attempt.score once the
    #    submission is scored, which is the moment there is something to report.
    attempts = db.scalars(
        select(Attempt)
        .where(
            Attempt.user_id == user_id,
            Attempt.status == "completed",
            Attempt.score.is_not(None),
            Attempt.created_at >= since,
        )
        .order_by(Attempt.created_at.desc())
        .limit(limit)
    ).all()

    title_cache: dict[int, str | None] = {}
    for a in attempts:
        category = _CATEGORY_LABEL.get(a.category, a.category.title())
        title = _question_title(db, a.question_id, title_cache) or a.question_type.replace("-", " ").title()
        items.append({
            "id": f"attempt-{a.id}",
            "kind": "practice_scored",
            "title": f"{category} attempt scored",
            "body": f"{title} — you scored {a.score}/10",
            "time": _relative_time(a.created_at, now),
            "created_at": a.created_at,
            "read": False,
            "href": f"/practice/{a.category}/{a.question_id}",
        })

    # 2. Completed mock tests, which is where a band score is reported.
    mock_attempts = db.scalars(
        select(MockAttempt)
        .where(
            MockAttempt.user_id == user_id,
            MockAttempt.status == "completed",
            MockAttempt.completed_at.is_not(None),
            MockAttempt.completed_at >= since,
        )
        .order_by(MockAttempt.completed_at.desc())
        .limit(limit)
    ).all()

    for ma in mock_attempts:
        test = db.get(MockTest, ma.mock_test_id) if ma.mock_test_id else None
        name = test.name if test is not None else "Mock test"
        pct = _score_pct(ma.total_score, ma.max_score)
        body = f"{name} — {ma.total_score}/{ma.max_score}" + (f" ({pct}%)" if pct is not None else "")
        items.append({
            "id": f"mock-{ma.id}",
            "kind": "mock_graded",
            "title": "Mock test graded",
            "body": body,
            "time": _relative_time(ma.completed_at, now),
            "created_at": ma.completed_at,
            "read": False,
            "href": f"/mock-test/result/{ma.id}",
        })

    items.sort(key=lambda i: i["created_at"], reverse=True)
    return items[:limit]
