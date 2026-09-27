from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.mock_test import MockTest
from app.models.user import User
from app.schemas.mock_test import (
    MockAttemptListOut,
    MockAttemptOut,
    MockAttemptResultOut,
    MockAttemptStartOut,
    MockSubmitPayload,
    MockTestDetailOut,
    MockTestListOut,
)
from app.services import mock_test_service

router = APIRouter(prefix="/mock-tests", tags=["mock-tests"])


def _attempt_out(attempt, test) -> MockAttemptOut:
    return MockAttemptOut(
        id=attempt.id,
        mock_test_id=attempt.mock_test_id,
        status=attempt.status,
        test_name=test.name if test else "Mock Test",
        kind=test.kind if test else "section",
        category=test.category if test else None,
        duration_minutes=test.duration_minutes if test else 0,
        total_score=attempt.total_score,
        max_score=attempt.max_score,
        started_at=attempt.started_at,
        completed_at=attempt.completed_at,
    )


def _get_with_test(db: Session, user: User, attempt_id: int):
    attempt = mock_test_service.get_attempt(db, user, attempt_id)
    test = db.get(MockTest, attempt.mock_test_id)
    return attempt, test


@router.get("", response_model=MockTestListOut)
def list_mock_tests(
    section: str | None = Query(
        default=None, description='Filter by kind: "full_length" or "section"'
    ),
    db: Session = Depends(get_db),
) -> MockTestListOut:
    tests = mock_test_service.list_tests(db)
    if section is not None:
        tests = [t for t in tests if t.kind == section]
    return MockTestListOut(items=tests, total=len(tests))


# NOTE: attempt routes must be declared before the `/mock-tests/{test_id}` route
# to avoid "{test_id}" matching the literal "attempts" path segment.

@router.get("/attempts", response_model=MockAttemptListOut)
def list_mock_attempts(
    current_user: User = Depends(get_current_user),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> MockAttemptListOut:
    attempts = mock_test_service.list_attempts(db, current_user, limit, offset)
    ids = [a.mock_test_id for a in attempts]
    tests = {t.id: t for t in db.query(MockTest).filter(MockTest.id.in_(ids)).all()}
    items = [_attempt_out(a, tests.get(a.mock_test_id)) for a in attempts]
    return MockAttemptListOut(items=items, total=len(items))


@router.post("/attempts/{attempt_id}/submit", response_model=MockAttemptResultOut)
def submit_mock_attempt(
    attempt_id: int,
    payload: MockSubmitPayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MockAttemptResultOut:
    attempt, test = _get_with_test(db, current_user, attempt_id)
    mock_test_service.submit_attempt(db, current_user, attempt, payload.answers)
    return _build_result_out(attempt, test)


@router.get("/attempts/{attempt_id}", response_model=MockAttemptResultOut)
def get_mock_attempt_result(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MockAttemptResultOut:
    attempt, test = _get_with_test(db, current_user, attempt_id)
    return _build_result_out(attempt, test)


def _build_result_out(attempt, test) -> MockAttemptResultOut:
    per_question = []
    for q in attempt.questions or []:
        qid = str(q["id"])
        result = (attempt.results or {}).get(qid, {})
        per_question.append(
            {
                "question_id": q["id"],
                "category": q["category"],
                "type": q["type"],
                "title": q.get("title"),
                "content": q.get("content"),
                "score": result.get("score", 0),
                "max_score": result.get("max_score", 0),
                "correct": result.get("correct", False),
                "feedback": result.get("feedback", ""),
            }
        )
    return MockAttemptResultOut(
        id=attempt.id,
        mock_test_id=attempt.mock_test_id,
        test_name=test.name if test else "Mock Test",
        status=attempt.status,
        total_score=attempt.total_score or 0,
        max_score=attempt.max_score or 0,
        per_question=per_question,
        started_at=attempt.started_at,
        completed_at=attempt.completed_at,
    )


@router.get("/{test_id}", response_model=MockTestDetailOut)
def get_mock_test_detail(test_id: int, db: Session = Depends(get_db)) -> MockTestDetailOut:
    test = mock_test_service.get_test(db, test_id)
    return MockTestDetailOut(
        id=test.id,
        name=test.name,
        slug=test.slug,
        description=test.description,
        kind=test.kind,
        category=test.category,
        duration_minutes=test.duration_minutes,
        total_questions=len(mock_test_service._compose_questions(db, test)),
        created_at=test.created_at,
    )


@router.post("/{test_id}/start", response_model=MockAttemptStartOut)
def start_mock_test(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MockAttemptStartOut:
    test = mock_test_service.get_test(db, test_id)
    attempt = mock_test_service.start_attempt(db, current_user, test)
    return MockAttemptStartOut(
        attempt_id=attempt.id,
        mock_test_id=test.id,
        name=test.name,
        duration_minutes=test.duration_minutes,
        questions=attempt.questions,
        started_at=attempt.started_at,
    )
