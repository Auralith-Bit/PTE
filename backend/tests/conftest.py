import os

os.environ["DATABASE_URL"] = "postgresql+psycopg2://postgres:123456@localhost:5432/PTE_AI_test"

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
