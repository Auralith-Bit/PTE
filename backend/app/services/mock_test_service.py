import logging
from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.mock_test import MockAttempt, MockTest
from app.models.question import Question
from app.models.user import User
from app.schemas.practice import _strip_answers
from app.services.scoring import score_submission

log = logging.getLogger("app.mock_test")


def _question_snapshot(q: Question) -> dict:
    return {
        "id": q.id,
        "category": q.category,
        "type": q.type,
        "title": q.title,
        "instructions": q.instructions,
        "content": _strip_answers(q.content),
    }


def _compose_questions(db: Session, mock_test: MockTest) -> list[Question]:
    stmt = select(Question)
    if mock_test.kind == "section":
        if not mock_test.category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Section tests must have a category",
            )
        stmt = stmt.where(Question.category == mock_test.category)
    stmt = stmt.order_by(Question.category, Question.type, Question.id)
    return list(db.scalars(stmt).all())


def list_tests(db: Session, active_only: bool = True) -> list[MockTest]:
    stmt = select(MockTest).order_by(MockTest.sort_order, MockTest.id)
    if active_only:
        stmt = stmt.where(MockTest.is_active.is_(True))
    return list(db.scalars(stmt).all())


def get_test(db: Session, test_id: int) -> MockTest:
    test = db.get(MockTest, test_id)
    if test is None or not test.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mock test not found")
    return test


def get_test_by_slug(db: Session, slug: str) -> MockTest:
    test = db.scalar(select(MockTest).where(MockTest.slug == slug, MockTest.is_active.is_(True)))
    if test is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mock test not found")
    return test


def start_attempt(db: Session, user: User, test: MockTest) -> MockAttempt:
    questions = _compose_questions(db, test)
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No questions available for this mock test yet",
        )
    attempt = MockAttempt(
        user_id=user.id,
        mock_test_id=test.id,
        status="in_progress",
        questions=[_question_snapshot(q) for q in questions],
        answers={},
        results={},
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    log.info(
        "User id=%d started mock test id=%d (attempt=%d, %d questions)",
        user.id,
        test.id,
        attempt.id,
        len(questions),
    )
    return attempt


def _owned_attempt(db: Session, user: User, attempt_id: int) -> MockAttempt:
    attempt = db.get(MockAttempt, attempt_id)
    if attempt is None or attempt.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attempt not found")
    return attempt


def get_attempt(db: Session, user: User, attempt_id: int) -> MockAttempt:
    return _owned_attempt(db, user, attempt_id)


def submit_attempt(db: Session, user: User, attempt: MockAttempt, payload_answers: dict[str, dict]):
    if attempt.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This mock test attempt has already been submitted",
        )

    questions = attempt.questions or []
    question_ids = [q["id"] for q in questions]
    if not question_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No questions in this mock test attempt",
        )

    # Re-read full content (includes answer keys) purely for server-side scoring.
    full_by_id = {
        q.id: q for q in db.scalars(select(Question).where(Question.id.in_(question_ids))).all()
    }

    results: dict[str, dict] = {}
    total = 0
    max_total = 0

    for q in questions:
        qid = str(q["id"])
        full_question = full_by_id.get(q["id"])
        answer = payload_answers.get(qid) or {}
        if full_question is None:
            results[qid] = {
                "score": 0,
                "max_score": 0,
                "correct": False,
                "feedback": "Question not available",
            }
            continue
        result = score_submission(q["category"], q["type"], full_question.content, answer)
        results[qid] = {
            "score": result.score,
            "max_score": result.max_score,
            "correct": result.score == result.max_score,
            "feedback": result.feedback,
        }
        total += result.score
        max_total += result.max_score

    attempt.answers = {str(k): v for k, v in payload_answers.items()}
    attempt.results = results
    attempt.total_score = total
    attempt.max_score = max_total
    attempt.status = "completed"
    attempt.completed_at = datetime.now(UTC)
    db.commit()
    db.refresh(attempt)
    log.info(
        "User id=%d completed mock attempt id=%d score=%d/%d",
        user.id,
        attempt.id,
        total,
        max_total,
    )
    return attempt


def list_attempts(db: Session, user: User, limit: int = 20, offset: int = 0) -> list[MockAttempt]:
    stmt = (
        select(MockAttempt)
        .where(MockAttempt.user_id == user.id)
        .order_by(MockAttempt.started_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return list(db.scalars(stmt).all())


def count_completed_attempts(db: Session, user_id: int) -> int:
    return (
        db.scalar(
            select(func.count())
            .select_from(MockAttempt)
            .where(MockAttempt.user_id == user_id, MockAttempt.status == "completed")
        )
        or 0
    )
