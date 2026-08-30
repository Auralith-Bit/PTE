from datetime import datetime

from pydantic import BaseModel, ConfigDict

# Keys inside `content` that must never be exposed to clients.
# Correct answers are stored server-side; AI scoring compares at submit time.
_ANSWER_KEYS = ("correct", "correct_answer", "answer", "answers", "order")


def _strip_answers(content: dict) -> dict:
    return {k: v for k, v in content.items() if k not in _ANSWER_KEYS}


class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    type: str
    title: str | None
    instructions: str | None
    difficulty: str
    content: dict
    created_at: datetime

    @classmethod
    def from_question(cls, question) -> "QuestionOut":
        return cls(
            id=question.id,
            category=question.category,
            type=question.type,
            title=question.title,
            instructions=question.instructions,
            difficulty=question.difficulty,
            content=_strip_answers(question.content),
            created_at=question.created_at,
        )


class QuestionListOut(BaseModel):
    items: list[QuestionOut]
    total: int


class AnswerSubmission(BaseModel):
    """User's answer to a question for scoring."""
    question_id: int
    answer: dict

    @property
    def answer_text(self) -> str:
        return str(self.answer.get("response") or self.answer.get("text") or "")


class AnswerResult(BaseModel):
    score: int
    max_score: int
    feedback: str
    correct: bool
    attempt_id: int

    @classmethod
    def from_result(cls, attempt_id: int, score: int, max_score: int, feedback: str) -> "AnswerResult":
        return cls(
            score=score,
            max_score=max_score,
            feedback=feedback,
            correct=score == max_score,
            attempt_id=attempt_id,
        )
