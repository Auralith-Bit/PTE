from typing import Any

from pydantic import BaseModel


class ActivityItem(BaseModel):
    title: str
    status: str  # "completed" | "in_progress" | "not_started"
    time: str


class DashboardSummary(BaseModel):
    # Stats cards
    practice_completed_pct: int
    practice_completed_weekly_delta: int
    questions_solved: int
    questions_solved_weekly_delta: int
    mock_tests_taken: int
    mock_tests_weekly_delta: int

    # Overall progress
    overall_progress_pct: int
    target_score: int

    # Today's goal
    goal_description: str
    goal_total: int
    goal_done: int

    # Study streak
    streak_days: int
    streak_week: list[bool]  # 7 booleans Mon-Sun

    # Practice sections
    speaking_pct: int
    writing_pct: int
    reading_pct: int
    listening_pct: int

    # Recent mock test
    recent_mock_name: str
    recent_mock_score: int
    recent_mock_completed_label: str

    # Upcoming course
    upcoming_course_name: str
    upcoming_course_progress_pct: int

    # Recent activity
    recent_activity: list[dict[str, Any]]
