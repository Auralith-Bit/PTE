from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.dashboard import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(current_user: User = Depends(get_current_user)) -> DashboardSummary:
    """Return dashboard summary data for the logged-in user.

    NOTE: Returns realistic mock/seeded data until the Attempt, Streak, Course,
    and MockTest DB models are implemented. The Pydantic schema contract is
    already established so the frontend only needs to update this endpoint.
    """
    return DashboardSummary(
        # Stats cards
        practice_completed_pct=72,
        practice_completed_weekly_delta=8,
        questions_solved=1220,
        questions_solved_weekly_delta=5,
        mock_tests_taken=20,
        mock_tests_weekly_delta=9,
        # Overall progress ring (right panel)
        overall_progress_pct=75,
        target_score=79,
        # Today's goal
        goal_description="Practice 5 questions",
        goal_total=5,
        goal_done=4,
        # Study streak
        streak_days=12,
        streak_week=[True, True, True, True, True, True, False],  # Mon-Sun
        # Practice sections
        speaking_pct=82,
        writing_pct=74,
        reading_pct=86,
        listening_pct=70,
        # Recent mock test
        recent_mock_name="PTE Mock Test #18",
        recent_mock_score=74,
        recent_mock_completed_label="Completed Yesterday",
        # Upcoming course
        upcoming_course_name="PTE Academic Beginner",
        upcoming_course_progress_pct=60,
        # Recent activity
        recent_activity=[
            {"title": "Read Aloud", "status": "completed", "time": "Today"},
            {"title": "Repeat Sentence", "status": "completed", "time": "Today"},
            {"title": "Describe Image", "status": "completed", "time": "Today"},
            {"title": "Retell Lecture", "status": "in_progress", "time": "Today"},
            {"title": "Answer Question", "status": "not_started", "time": "Today"},
        ],
    )
