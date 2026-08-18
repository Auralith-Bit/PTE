import logging

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import compute_dashboard_summary

log = logging.getLogger("app.dashboard")

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db=Depends(get_db),
) -> DashboardSummary:
    """Return real dashboard summary data computed from user's attempts."""
    data = compute_dashboard_summary(db, current_user.id)
    log.info("Dashboard summary for user id=%d: %d attempts", current_user.id, data["questions_solved"])
    return DashboardSummary(**data)
