from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.question import Question


def get_questions(
    db: Session,
    category: str,
    type: str | None = None,
    difficulty: str | None = None,
    limit: int = 20,
    offset: int = 0,
    random: bool = False,
) -> list[Question]:
    stmt = select(Question).where(Question.category == category)
    if type is not None:
        stmt = stmt.where(Question.type == type)
    if difficulty is not None:
        stmt = stmt.where(Question.difficulty == difficulty)
    if random:
        stmt = stmt.order_by(func.random())
    stmt = stmt.limit(limit).offset(offset)
    return list(db.scalars(stmt).all())


def count_questions(
    db: Session,
    category: str,
    type: str | None = None,
    difficulty: str | None = None,
) -> int:
    stmt = select(func.count()).select_from(Question).where(Question.category == category)
    if type is not None:
        stmt = stmt.where(Question.type == type)
    if difficulty is not None:
        stmt = stmt.where(Question.difficulty == difficulty)
    return db.scalar(stmt) or 0
