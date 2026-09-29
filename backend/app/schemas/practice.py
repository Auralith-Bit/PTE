from datetime import datetime

from pydantic import BaseModel, ConfigDict

# Keys inside `content` that must never be exposed to clients.
# Correct answers are stored server-side; AI scoring compares at submit time.
#
# `notes` is the model answer for speaking questions and is the only field the
# scorers read as a reference (see app/services/speaking_scorer.py). It used to
# ship to the browser, so anyone could read the expected answer out of the
# network tab and score 10/10.
#
# `transcript` is deliberately NOT stripped: for listening questions it is the
# study material the UI renders ("Audio / Transcript"), so removing it would
# break the listening task. It is not treated as a secret for that reason.
_ANSWER_KEYS = (
    "correct",
    "correct_answer",
    "answer",
    "answers",
    "order",
    "notes",
    "reference",
    "model_answer",
    "sample_answer",
)


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
