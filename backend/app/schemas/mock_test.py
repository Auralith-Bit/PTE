from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MockTestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: str | None
    kind: str
    category: str | None
    duration_minutes: int
    created_at: datetime


class MockTestListOut(BaseModel):
    items: list[MockTestOut]
    total: int


class MockQuestionOut(BaseModel):
    id: int
    category: str
    type: str
    title: str | None
    instructions: str | None
    content: dict


class MockAttemptStartOut(BaseModel):
    attempt_id: int
    mock_test_id: int
    name: str
    duration_minutes: int
    questions: list[MockQuestionOut]
    started_at: datetime


class MockTestSummaryOut(BaseModel):
    id: int
    name: str
    description: str | None
    kind: str
    category: str | None
    duration_minutes: int
    question_count: int
    created_at: datetime


class MockTestDetailOut(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None
    kind: str
    category: str | None
    duration_minutes: int
    total_questions: int
    created_at: datetime


class MockAttemptOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mock_test_id: int
    status: str
    test_name: str
    kind: str
    category: str | None
    duration_minutes: int
    total_score: int | None
    max_score: int | None
    started_at: datetime
    completed_at: datetime | None


class MockAttemptListOut(BaseModel):
    items: list[MockAttemptOut]
    total: int


class MockSubmitPayload(BaseModel):
    answers: dict[str, dict] = Field(..., description="question_id -> answer dict")


class MockAttemptResultOut(BaseModel):
    id: int
    mock_test_id: int
    test_name: str
    status: str
    total_score: int
    max_score: int
    per_question: list[dict]
    started_at: datetime
    completed_at: datetime | None
