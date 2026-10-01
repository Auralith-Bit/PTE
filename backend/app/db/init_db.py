import sys

from sqlalchemy import func, select

from app.core.database import SessionLocal
from app.db.seed_data import build_seed_questions
from app.models.mock_test import MockTest
from app.models.notification import Notification
from app.models.question import Question
from app.models.user import User


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


SEED_NOTIFICATIONS = [
    {
        "title": "Welcome to PTE Prep",
        "body": "Pick a learning path to get started. You can change it at any time.",
        "href": "/courses#choose-learning-path",
        "is_read": False,
    },
    {
        "title": "New mock test available",
        "body": "A full-length mock test is ready. Sit it under real exam conditions.",
        "href": "/mock-test",
        "is_read": False,
    },
    {
        "title": "Your study plan",
        "body": "Review your personalised study schedule mapped to your exam date.",
        "href": "/resources",
        "is_read": False,
    },
    {
        "title": "Practice speaking daily",
        "body": "Short daily speaking sessions build fluency faster than long ones.",
        "href": "/practice/speaking",
        "is_read": True,
    },
    {
        "title": "Tip: use the full 20 seconds",
        "body": "The recording window does not close early. Use the whole allocation "
        "for Summarize Spoken Test items.",
        "href": "/practice/listening",
        "is_read": True,
    },
]


def seed_notifications() -> int:
    """Give every user a starter notification feed if they have none.

    Idempotent: a user who already has rows is left alone, so re-running never
    duplicates their feed. The mix of read and unread rows is deliberate, so
    the bell badge, the unread highlight, and the "nothing new" state are all
    reachable in development without waiting on real events.

    Returns the number of notifications inserted.
    """
    inserted = 0
    with SessionLocal() as db:
        user_ids = db.scalars(select(User.id).order_by(User.id)).all()
        for user_id in user_ids:
            existing = (
                db.scalar(
                    select(func.count())
                    .select_from(Notification)
                    .where(Notification.user_id == user_id)
                )
                or 0
            )
            if existing > 0:
                continue
            for n in SEED_NOTIFICATIONS:
                db.add(Notification(user_id=user_id, **n))
                inserted += 1
        db.commit()
        return inserted


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "add-missing":
        count = add_missing_question_types()
        print(f"Inserted {count} missing questions.")
    elif len(sys.argv) > 1 and sys.argv[1] == "mock-tests":
        count = seed_mock_tests()
        print(f"Inserted {count} mock tests.")
    elif len(sys.argv) > 1 and sys.argv[1] == "notifications":
        count = seed_notifications()
        print(f"Inserted {count} notifications.")
    else:
        inserted = seed_questions()
        mock_inserted = seed_mock_tests()
        notif_inserted = seed_notifications()
        print(
            f"Inserted {inserted} questions, {mock_inserted} mock tests "
            f"and {notif_inserted} notifications."
        )
