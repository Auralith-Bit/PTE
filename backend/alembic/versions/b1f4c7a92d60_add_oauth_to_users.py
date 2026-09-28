"""add oauth identity columns to users

Revision ID: b1f4c7a92d60
Revises: 94e6df991fac
Create Date: 2026-09-28 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'b1f4c7a92d60'
down_revision: Union[str, Sequence[str], None] = '94e6df991fac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # server_default backfills 'password' for every existing row.
    op.alter_column(
        'users',
        'password_hash',
        existing_type=sa.String(length=255),
        nullable=True,
    )
    op.add_column(
        'users',
        sa.Column('auth_provider', sa.String(length=32), nullable=False, server_default='password'),
    )
    op.add_column('users', sa.Column('provider_user_id', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('avatar_url', sa.String(length=1024), nullable=True))
    op.create_index(op.f('ix_users_auth_provider'), 'users', ['auth_provider'], unique=False)
    op.create_unique_constraint(
        'uq_users_provider_identity',
        'users',
        ['auth_provider', 'provider_user_id'],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('uq_users_provider_identity', 'users', type_='unique')
    op.drop_index(op.f('ix_users_auth_provider'), table_name='users')
    op.drop_column('users', 'avatar_url')
    op.drop_column('users', 'provider_user_id')
    op.drop_column('users', 'auth_provider')
    # OAuth-only accounts have no password hash and cannot survive the downgrade.
    op.execute("DELETE FROM users WHERE password_hash IS NULL")
    op.alter_column(
        'users',
        'password_hash',
        existing_type=sa.String(length=255),
        nullable=False,
    )
