import sys

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


def add_missing_question_types() -> int:
    """Insert questions for any (category, type) pair not already present.

    Idempotent: runs against an already-seeded database without touching
    existing rows or user data. Returns number of questions inserted.
    """
    questions = build_seed_questions()
    inserted = 0
    with SessionLocal() as db:
        existing_pairs = set(
            db.execute(select(Question.category, Question.type).distinct()).all()
        )
        for q in questions:
            if (q["category"], q["type"]) in existing_pairs:
                continue
            db.add(
                Question(
                    category=q["category"],
                    type=q["type"],
                    difficulty=q["difficulty"],
                    content=q["content"],
                )
            )
            inserted += 1
        db.commit()
        return inserted


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "add-missing":
        count = add_missing_question_types()
        print(f"Inserted {count} missing questions.")
    else:
        inserted = seed_questions()
        print(f"Inserted {inserted} questions.")
