import logging

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.attempt import Attempt
from app.models.question import Question
from app.models.user import User
from app.schemas.practice import AnswerResult, AnswerSubmission
from app.services.scoring import score_submission

log = logging.getLogger("app.submit")


def submit_answer(
    db: Session,
    user: User,
    category: str,
    payload: AnswerSubmission,
) -> AnswerResult:
    question = db.get(Question, payload.question_id)
    if question is None or question.category != category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    result = score_submission(category, question.type, question.content, payload.answer)

    attempt = Attempt(
        user_id=user.id,
        question_id=question.id,
        category=category,
        question_type=question.type,
        status="completed",
        score=result.score,
        answer=payload.answer,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    log.info(
        "User id=%d submitted %s/%s (qid=%d): score=%d/%d",
        user.id,
        category,
        question.type,
        question.id,
        result.score,
        result.max_score,
    )

    return AnswerResult.from_result(
        attempt_id=attempt.id,
        score=result.score,
        max_score=result.max_score,
        feedback=result.feedback,
    )
