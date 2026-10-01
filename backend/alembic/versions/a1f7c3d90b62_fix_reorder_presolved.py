"""fix re-order-paragraphs seeded answer being pre-solved

The seeded re-order-paragraphs question stored its paragraphs already in the
correct narrative order with "order": [0, 1, 2, 3]. The client initialises its
own reorder state with the identity permutation, so the untouched initial state
was byte-identical to the answer key and an unedited submit scored 10/10.

The paragraphs are now stored in a scrambled display order and "order" holds the
permutation that restores the narrative, so [0, 1, 2, 3] is a wrong answer.

Revision ID: a1f7c3d90b62
Revises: c3d8e1f70a45
Create Date: 2026-09-30 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'a1f7c3d90b62'
down_revision: Union[str, Sequence[str], None] = 'c3d8e1f70a45'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Darwin voyage -> finches -> theory -> publication, re-indexed against the
# scrambled display order below.
_SCRAMBLED_PARAGRAPHS = [
    "These observations led him to develop his theory of natural selection.",
    "His work, published in 1859 as On the Origin of Species, transformed the biological sciences.",
    "Charles Darwin spent five years aboard the HMS Beagle, collecting specimens and recording observations.",
    "During the voyage, he was particularly struck by the variety of finches on the Galapagos Islands.",
]
_CORRECT_ORDER = [2, 3, 0, 1]

# The narrative order the paragraphs were originally stored in, so downgrade
# can put them back exactly as they were.
_ORIGINAL_PARAGRAPHS = [
    "Charles Darwin spent five years aboard the HMS Beagle, collecting specimens and recording observations.",
    "During the voyage, he was particularly struck by the variety of finches on the Galapagos Islands.",
    "These observations led him to develop his theory of natural selection.",
    "His work, published in 1859 as On the Origin of Species, transformed the biological sciences.",
]
_ORIGINAL_ORDER = [0, 1, 2, 3]


def _is_legacy_pre_solved(content) -> bool:
    """Only rewrite the exact pre-solved shape, never a hand-authored question."""
    if not isinstance(content, dict):
        return False
    return content.get("order") == _ORIGINAL_ORDER and content.get("paragraphs") == _ORIGINAL_PARAGRAPHS


def upgrade() -> None:
    """De-presolve the seeded reorder question."""
    bind = op.get_bind()
    question = sa.table(
        "questions",
        sa.column("id", sa.Integer()),
        sa.column("content", sa.JSON()),
    )
    for row in bind.execute(sa.select(question.c.id, question.c.content)).mappings():
        if not _is_legacy_pre_solved(row["content"]):
            continue
        updated = dict(row["content"])
        updated["paragraphs"] = list(_SCRAMBLED_PARAGRAPHS)
        updated["order"] = list(_CORRECT_ORDER)
        bind.execute(
            question.update().where(question.c.id == row["id"]).values(content=updated)
        )


def downgrade() -> None:
    """Restore the original pre-solved seed."""
    bind = op.get_bind()
    question = sa.table(
        "questions",
        sa.column("id", sa.Integer()),
        sa.column("content", sa.JSON()),
    )
    for row in bind.execute(sa.select(question.c.id, question.c.content)).mappings():
        if not isinstance(row["content"], dict):
            continue
        if not (
            row["content"].get("order") == _CORRECT_ORDER
            and row["content"].get("paragraphs") == _SCRAMBLED_PARAGRAPHS
        ):
            continue
        updated = dict(row["content"])
        updated["paragraphs"] = list(_ORIGINAL_PARAGRAPHS)
        updated["order"] = list(_ORIGINAL_ORDER)
        bind.execute(
            question.update().where(question.c.id == row["id"]).values(content=updated)
        )
