import logging
from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.notification import NotificationItem, NotificationListOut
from app.services.notification_service import build_notifications

log = logging.getLogger("app.notifications")

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=NotificationListOut)
def list_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> NotificationListOut:
    """Return notifications derived from the user's graded work.

    Read state is a cursor on the user rather than a per-row flag, because the
    items themselves are recomputed on every request.
    """
    raw = build_notifications(db, current_user.id)

    read_at = current_user.notifications_read_at
    if read_at is not None and read_at.tzinfo is None:
        read_at = read_at.replace(tzinfo=UTC)

    items: list[NotificationItem] = []
    unread = 0
    for row in raw:
        created = row["created_at"]
        if created.tzinfo is None:
            created = created.replace(tzinfo=UTC)
        is_read = read_at is not None and created <= read_at
        if not is_read:
            unread += 1
        items.append(
            NotificationItem(
                id=row["id"],
                kind=row["kind"],
                title=row["title"],
                body=row["body"],
                time=row["time"],
                created_at=created.isoformat(),
                read=is_read,
                href=row["href"],
            )
        )

    return NotificationListOut(items=items, unread_count=unread)


@router.post("/read", response_model=NotificationListOut)
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> NotificationListOut:
    """Advance the read cursor to now and return the feed."""
    current_user.notifications_read_at = datetime.now(UTC)
    db.add(current_user)
    db.commit()
    log.info("Marked notifications read for user id=%d", current_user.id)
    return list_notifications(current_user=current_user, db=db)
