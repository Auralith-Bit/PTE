from sqlalchemy import func, select

from app.core.database import SessionLocal
from app.db.seed_data import build_seed_questions
from app.models.question import Question


def seed_questions() -> int:
    """Insert starter questions if the table is empty. Returns number inserted."""
    questions = build_seed_questions()
    with SessionLocal() as db:
        existing = db.scalar(select(func.count()).select_from(Question)) or 0
        if existing > 0:
            return 0
        for q in questions:
            db.add(
                Question(
                    category=q["category"],
                    type=q["type"],
                    difficulty=q["difficulty"],
                    content=q["content"],
                )
            )
        db.commit()
        return len(questions)


if __name__ == "__main__":
    inserted = seed_questions()
    print(f"Inserted {inserted} questions.")
