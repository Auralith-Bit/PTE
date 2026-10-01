from fastapi import APIRouter

from app.api.routers import (
    auth,
    dashboard,
    listening,
    mock_test,
    notification,
    reading,
    speaking,
    writing,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(mock_test.router)
api_router.include_router(speaking.router)
api_router.include_router(writing.router)
api_router.include_router(reading.router)
api_router.include_router(listening.router)
api_router.include_router(notification.router)
