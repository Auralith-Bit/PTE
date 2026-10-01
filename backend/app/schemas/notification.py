from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    body: str
    # NULL when the notification is informational and has no destination, in
    # which case the frontend must render it without a link.
    href: str | None
    is_read: bool
    created_at: datetime


class NotificationList(BaseModel):
    items: list[NotificationOut]
    # Returned alongside the page so the bell badge needs no second request.
    unread_count: int
    total: int