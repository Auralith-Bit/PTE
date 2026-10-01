import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationList, NotificationOut

log = logging.getLogger("app.notifications")

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=NotificationList)
def list_notifications(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> NotificationList:
    """Return the caller's notifications newest-first, plus their unread count.

    Every query is scoped to current_user.id. A notification id belonging to
    another user must not be reachable by guessing the id.
    """
    rows = db.scalars(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc(), Notification.id.desc())
        .limit(limit)
        .offset(offset)
    ).all()

    unread_count = db.scalar(
        select(func.count())
        .select_from(Notification)
        .where(Notification.user_id == current_user.id, Notification.is_read.is_(False))
    )
    total = db.scalar(
        select(func.count())
        .select_from(Notification)
        .where(Notification.user_id == current_user.id)
    )

    return NotificationList(
        items=[NotificationOut.model_validate(r) for r in rows],
        unread_count=int(unread_count or 0),
        total=int(total or 0),
    )


@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> NotificationOut:
    """Acknowledge one notification.

    The lookup filters on user_id as well as id, so another user's row returns
    404 rather than being mutated. Idempotent: re-reading an already-read
    notification returns it unchanged instead of erroring.
    """
    row = db.scalar(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found"
        )

    if not row.is_read:
        row.is_read = True
        db.commit()
        db.refresh(row)

    return NotificationOut.model_validate(row)


@router.post("/read-all", response_model=NotificationList)
def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> NotificationList:
    """Acknowledge every unread notification for the caller."""
    db.execute(
        update(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read.is_(False),
        )
        .values(is_read=True)
    )
    db.commit()
    log.info("Cleared notifications for user id=%d", current_user.id)

    # Reuse the list endpoint's query so the response shape cannot drift.
    return list_notifications(
        limit=100,
        offset=0,
        current_user=current_user,
        db=db,
    )