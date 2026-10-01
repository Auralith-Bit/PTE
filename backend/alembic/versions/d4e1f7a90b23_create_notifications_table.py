"""create notifications table

Revision ID: d4e1f7a90b23
Revises: a1f7c3d90b62
Create Date: 2026-10-01 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'd4e1f7a90b23'
down_revision: Union[str, Sequence[str], None] = 'a1f7c3d90b62'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('href', sa.String(length=1024), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        'ix_notifications_user_unread',
        'notifications',
        ['user_id', 'is_read'],
        unique=False,
    )
    op.create_index(
        'ix_notifications_user_created',
        'notifications',
        ['user_id', 'created_at'],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_notifications_user_created', table_name='notifications')
    op.drop_index('ix_notifications_user_unread', table_name='notifications')
    op.drop_table('notifications')