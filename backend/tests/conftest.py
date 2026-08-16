# ruff: noqa: E402
import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]


def _read_test_database_url() -> str:
    value = os.environ.get("TEST_DATABASE_URL")
    if value:
        return value
    env_path = BACKEND_DIR / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, raw = line.partition("=")
            if key.strip() == "TEST_DATABASE_URL":
                return raw.strip().strip('"').strip("'")
    raise RuntimeError(
        "TEST_DATABASE_URL is not set. Add TEST_DATABASE_URL=postgresql+psycopg2://... to backend/.env. "
        "The test suite drops and recreates every table in that database."
    )


os.environ["DATABASE_URL"] = _read_test_database_url()

import pytest
from fastapi.testclient import TestClient

from app.core.database import SessionLocal, engine
from app.db.base import Base
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def _reset_schema():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
