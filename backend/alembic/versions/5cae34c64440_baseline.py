"""baseline

Revision ID: 5cae34c64440
Revises: 
Create Date: 2026-08-14 12:35:52.470626

"""
from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = '5cae34c64440'
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
