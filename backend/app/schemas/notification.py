from pydantic import BaseModel, Field


class NotificationItem(BaseModel):
    id: str
    kind: str
    title: str
    body: str
    time: str
    created_at: str
    read: bool
    href: str | None = None


class NotificationListOut(BaseModel):
    items: list[NotificationItem]
    unread_count: int = Field(ge=0)
