from fastapi import APIRouter

from app.api.routers import auth, dashboard, listening, reading, speaking, writing

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(speaking.router)
api_router.include_router(writing.router)
api_router.include_router(reading.router)
api_router.include_router(listening.router)
