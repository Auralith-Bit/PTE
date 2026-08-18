from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.question import Question
from app.schemas.enums import ListeningType, QuestionDifficulty
from app.schemas.practice import QuestionListOut, QuestionOut
from app.services.question_service import count_questions, get_questions

router = APIRouter(prefix="/listening", tags=["listening"])


@router.get("/questions", response_model=QuestionListOut)
def list_questions(
    type: ListeningType | None = None,
    difficulty: QuestionDifficulty | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    shuffle: bool = False,
    db: Session = Depends(get_db),
) -> QuestionListOut:
    t = type.value if type else None
    d = difficulty.value if difficulty else None
    questions = get_questions(db, "listening", t, d, limit, offset, shuffle)
    total = count_questions(db, "listening", t, d)
    return QuestionListOut(
        items=[QuestionOut.from_question(q) for q in questions],
        total=total,
    )


@router.get("/questions/{question_id}", response_model=QuestionOut)
def get_question(question_id: int, db: Session = Depends(get_db)) -> QuestionOut:
    question = db.get(Question, question_id)
    if question is None or question.category != "listening":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return QuestionOut.from_question(question)
