"""add users.notifications_read_at

Notifications are derived from attempts and mock attempts rather than stored,
so read state needs one place to live. A single timestamp on the user records
how far through their feed they have read: anything created after it is unread.

Revision ID: b7d41e8c3f90
Revises: a1f7c3d90b62
Create Date: 2026-09-30 00:00:00.000000

"""
from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'b7d41e8c3f90'
down_revision: str | Sequence[str] | None = 'a1f7c3d90b62'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'users',
        sa.Column('notifications_read_at', sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'notifications_read_at')
