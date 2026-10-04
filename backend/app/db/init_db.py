import sys

from sqlalchemy import func, select

from app.core.database import SessionLocal
from app.db.seed_data import build_seed_questions
from app.models.mock_test import MockTest
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


MOCK_TEST_DEFINITIONS = [
    {
        "name": "Full Length Mock Test",
        "slug": "full-length",
        "description": "Complete PTE Academic mock test covering all four sections "
        "(Speaking, Writing, Reading, Listening).",
        "kind": "full_length",
        "category": None,
        "duration_minutes": 135,
    },
    {
        "name": "Speaking Mock Test",
        "slug": "section-speaking",
        "description": "Focused practice across all speaking task types.",
        "kind": "section",
        "category": "speaking",
        "duration_minutes": 40,
    },
    {
        "name": "Writing Mock Test",
        "slug": "section-writing",
        "description": "Focused practice across all writing task types.",
        "kind": "section",
        "category": "writing",
        "duration_minutes": 40,
    },
    {
        "name": "Reading Mock Test",
        "slug": "section-reading",
        "description": "Focused practice across all reading task types.",
        "kind": "section",
        "category": "reading",
        "duration_minutes": 30,
    },
    {
        "name": "Listening Mock Test",
        "slug": "section-listening",
        "description": "Focused practice across all listening task types.",
        "kind": "section",
        "category": "listening",
        "duration_minutes": 30,
    },
]


def seed_mock_tests() -> int:
    """Insert the default mock test definitions if none exist. Returns number inserted."""
    inserted = 0
    with SessionLocal() as db:
        existing = db.scalar(select(func.count()).select_from(MockTest)) or 0
        if existing > 0:
            return 0
        for i, t in enumerate(MOCK_TEST_DEFINITIONS):
            db.add(
                MockTest(
                    name=t["name"],
                    slug=t["slug"],
                    description=t["description"],
                    kind=t["kind"],
                    category=t["category"],
                    duration_minutes=t["duration_minutes"],
                    sort_order=i,
                )
            )
            inserted += 1
        db.commit()
        return inserted


def backfill_summary_key_points() -> int:
    """Attach `key_points` to summarising questions seeded before it existed.

    The summarising scorers read an aspect list to award the Content trait. Rows
    created before that field was introduced have only a transcript, and without
    this they fall back to scoring on length alone, which is not what the item
    is meant to test.

    Idempotent and additive: matched on the recording title, it only ever adds
    `key_points`, and it leaves rows that already carry the field untouched. It
    never rewrites a transcript or touches user attempts. Returns rows updated.
    """
    from app.db.seed_data import SUMMARY_KEY_POINTS

    updated = 0
    with SessionLocal() as db:
        rows = db.execute(
            select(Question).where(
                Question.type.in_(("summarize-spoken-test", "retell-lecture"))
            )
        ).scalars().all()
        for row in rows:
            content = dict(row.content or {})
            if content.get("key_points"):
                continue
            points = SUMMARY_KEY_POINTS.get(content.get("title", ""))
            if not points:
                continue
            content["key_points"] = points
            row.content = content
            updated += 1
        db.commit()
    return updated


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "add-missing":
        count = add_missing_question_types()
        print(f"Inserted {count} missing questions.")
    elif len(sys.argv) > 1 and sys.argv[1] == "backfill-key-points":
        count = backfill_summary_key_points()
        print(f"Backfilled key_points on {count} questions.")
    elif len(sys.argv) > 1 and sys.argv[1] == "mock-tests":
        count = seed_mock_tests()
        print(f"Inserted {count} mock tests.")
    else:
        inserted = seed_questions()
        mock_inserted = seed_mock_tests()
        print(f"Inserted {inserted} questions and {mock_inserted} mock tests.")
