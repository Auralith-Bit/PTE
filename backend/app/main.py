import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging

setup_logging()
log = logging.getLogger("app")

app = FastAPI(title=settings.app_name, version=settings.app_version, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - start) * 1000
    log.info("%s %s -> %s (%.1fms)", request.method, request.url.path, response.status_code, elapsed_ms)
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    log.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    try:
        from app.core.database import engine

        with engine.connect() as conn:
            conn.execute(__import__("sqlalchemy").text("SELECT 1"))
        return {"status": "ok", "database": "connected", "version": settings.app_version}
    except Exception:
        log.exception("Health check failed")
        return {"status": "degraded", "database": "disconnected", "version": settings.app_version}
