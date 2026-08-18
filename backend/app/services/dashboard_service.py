import logging
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.attempt import Attempt
from app.models.question import Question

log = logging.getLogger("app.dashboard")


def _count_by_category(db: Session, user_id: int) -> tuple[dict[str, int], dict[str, int]]:
    total = {}
    done = {}
    for cat in ("speaking", "writing", "reading", "listening"):
        total[cat] = db.scalar(
            select(func.count()).select_from(Question).where(Question.category == cat)
        ) or 0
        done[cat] = db.scalar(
            select(func.count())
            .select_from(Attempt)
            .where(Attempt.user_id == user_id, Attempt.category == cat, Attempt.status == "completed")
        ) or 0
    return total, done


def _section_pct(done: int, total: int) -> int:
    return round((done / total) * 100) if total > 0 else 0


def compute_dashboard_summary(db: Session, user_id: int) -> dict:
    now = func.now()
    seven_days_ago = now - timedelta(days=7)
    today_start = func.date_trunc("day", now)

    total_by_cat, done_by_cat = _count_by_category(db, user_id)
    total_questions = sum(total_by_cat.values()) or 1

    completed = sum(done_by_cat.values())

    completed_this_week = db.scalar(
        select(func.count())
        .select_from(Attempt)
        .where(
            Attempt.user_id == user_id,
            Attempt.status == "completed",
            Attempt.created_at >= seven_days_ago,
        )
    ) or 0

    prev_week_start = seven_days_ago - timedelta(days=7)
    completed_prev_week = db.scalar(
        select(func.count())
        .select_from(Attempt)
        .where(
            Attempt.user_id == user_id,
            Attempt.status == "completed",
            Attempt.created_at >= prev_week_start,
            Attempt.created_at < seven_days_ago,
        )
    ) or 0

    practice_completed_pct = round((completed / total_questions) * 100)
    practice_weekly_delta = completed_this_week - completed_prev_week

    if completed_prev_week > 0:
        questions_delta_pct = round(
            ((completed_this_week - completed_prev_week) / completed_prev_week) * 100
        )
    else:
        questions_delta_pct = completed_this_week

    speaking_pct = _section_pct(done_by_cat["speaking"], total_by_cat["speaking"])
    writing_pct = _section_pct(done_by_cat["writing"], total_by_cat["writing"])
    reading_pct = _section_pct(done_by_cat["reading"], total_by_cat["reading"])
    listening_pct = _section_pct(done_by_cat["listening"], total_by_cat["listening"])

    active_pcts = [p for p in [speaking_pct, writing_pct, reading_pct, listening_pct] if p > 0]
    overall_progress_pct = round(sum(active_pcts) / len(active_pcts)) if active_pcts else 0

    today_attempts = db.scalar(
        select(func.count())
        .select_from(Attempt)
        .where(
            Attempt.user_id == user_id,
            Attempt.status == "completed",
            Attempt.created_at >= today_start,
        )
    ) or 0
    goal_total = 5
    goal_done = min(today_attempts, goal_total)

    # Study streak
    streak_days = 0
    streak_week = [False] * 7

    attempt_dates = db.execute(
        select(func.date_trunc("day", Attempt.created_at).label("day"))
        .where(Attempt.user_id == user_id, Attempt.status == "completed")
        .group_by(func.date_trunc("day", Attempt.created_at))
        .order_by(func.date_trunc("day", Attempt.created_at).desc())
        .limit(30)
    ).scalars().all()

    if attempt_dates:
        today = datetime.now(UTC).date()
        streak_count = 0
        for d in attempt_dates:
            dt = d if isinstance(d, datetime) else datetime.combine(d, datetime.min.time())
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=UTC)
            diff = (today - dt.date()).days
            if diff == streak_count:
                streak_count += 1
            else:
                break
        streak_days = streak_count

        week_start = today - timedelta(days=today.weekday())
        for d in attempt_dates:
            dt = d if isinstance(d, datetime) else datetime.combine(d, datetime.min.time())
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=UTC)
            if dt.date() >= week_start:
                streak_week[dt.date().weekday()] = True

    # Recent activity (last 5 completed attempts)
    recent_attempts = (
        db.query(Attempt)
        .filter(Attempt.user_id == user_id, Attempt.status == "completed")
        .order_by(Attempt.created_at.desc())
        .limit(5)
        .all()
    )
    recent_activity = []
    now_dt = datetime.now(UTC)
    for a in recent_attempts:
        created = a.created_at if a.created_at.tzinfo else a.created_at.replace(tzinfo=UTC)
        diff_hours = (now_dt - created).total_seconds() / 3600
        if diff_hours < 1:
            time_label = "Just now"
        elif diff_hours < 24:
            time_label = f"{int(diff_hours)}h ago"
        elif diff_hours < 48:
            time_label = "Yesterday"
        else:
            time_label = f"{int(diff_hours / 24)}d ago"
        recent_activity.append({
            "title": a.question_type.replace("-", " ").title(),
            "status": "completed",
            "time": time_label,
        })

    return {
        "practice_completed_pct": practice_completed_pct,
        "practice_completed_weekly_delta": practice_weekly_delta,
        "questions_solved": completed,
        "questions_solved_weekly_delta": questions_delta_pct,
        "mock_tests_taken": 0,
        "mock_tests_weekly_delta": 0,
        "overall_progress_pct": overall_progress_pct,
        "target_score": 79,
        "goal_description": "Practice 5 questions today",
        "goal_total": goal_total,
        "goal_done": goal_done,
        "streak_days": streak_days,
        "streak_week": streak_week,
        "speaking_pct": speaking_pct,
        "writing_pct": writing_pct,
        "reading_pct": reading_pct,
        "listening_pct": listening_pct,
        "recent_mock_name": "No mock tests yet",
        "recent_mock_score": 0,
        "recent_mock_completed_label": "—",
        "upcoming_course_name": "No courses yet",
        "upcoming_course_progress_pct": 0,
        "recent_activity": recent_activity,
    }
