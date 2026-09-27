import pytest

from app.core.database import SessionLocal
from app.models.mock_test import MockAttempt


@pytest.fixture
def auth_headers(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "mock@solver.com", "password": "password123", "full_name": "Mock"},
    )
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "mock@solver.com", "password": "password123"},
    ).json()
    return {"Authorization": f"Bearer {login['access_token']}"}


def _section_test_id(client, category: str) -> int:
    data = client.get("/api/v1/mock-tests").json()["items"]
    test = next(t for t in data if t["kind"] == "section" and t["category"] == category)
    return test["id"]


def _full_test_id(client) -> int:
    data = client.get("/api/v1/mock-tests").json()["items"]
    return next(t for t in data if t["kind"] == "full_length")["id"]


def test_list_mock_tests_public(client):
    res = client.get("/api/v1/mock-tests")
    assert res.status_code == 200
    body = res.json()
    assert body["total"] >= 5
    kinds = {t["kind"] for t in body["items"]}
    assert "full_length" in kinds and "section" in kinds


def test_get_mock_test_detail(client):
    tid = _section_test_id(client, "speaking")
    res = client.get(f"/api/v1/mock-tests/{tid}")
    assert res.status_code == 200
    body = res.json()
    assert body["total_questions"] > 0
    assert body["kind"] == "section"
    assert body["category"] == "speaking"


def test_start_attempt_requires_auth(client):
    tid = _full_test_id(client)
    res = client.post(f"/api/v1/mock-tests/{tid}/start")
    assert res.status_code == 401


def test_start_section_attempt_strips_answers(client, auth_headers, db_session):
    tid = _section_test_id(client, "writing")
    res = client.post(f"/api/v1/mock-tests/{tid}/start", headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert body["questions"], "expected at least 1 question"
    for q in body["questions"]:
        for key in ("correct", "correct_answer", "answer", "answers", "order"):
            assert key not in q["content"], f"leaked answer key {key}"
    attempt = db_session.get(MockAttempt, body["attempt_id"])
    assert attempt is not None
    assert attempt.status == "in_progress"


def test_submit_mock_attempt_scores(client, auth_headers):
    tid = _section_test_id(client, "writing")
    started = client.post(f"/api/v1/mock-tests/{tid}/start", headers=auth_headers).json()
    aid = started["attempt_id"]
    # Answer every question with the correct response (use full content from DB)
    session = SessionLocal()
    try:
        answers = {}
        for q in started["questions"]:
            full = session.get(__import__("app.models.question", fromlist=["Question"]).Question, q["id"])
            correct = full.content.get("answer") or full.content.get("correct")
            if isinstance(correct, list):
                correct = correct[0]
            answers[str(q["id"])] = {} if correct is None else {"response": correct}
    finally:
        session.close()
    res = client.post(
        f"/api/v1/mock-tests/attempts/{aid}/submit",
        json={"answers": answers},
        headers=auth_headers,
    )
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "completed"
    assert body["max_score"] > 0
    assert len(body["per_question"]) == len(started["questions"])


def test_completed_attempt_cannot_resubmit(client, auth_headers):
    tid = _section_test_id(client, "reading")
    started = client.post(f"/api/v1/mock-tests/{tid}/start", headers=auth_headers).json()
    aid = started["attempt_id"]
    client.post(
        f"/api/v1/mock-tests/attempts/{aid}/submit",
        json={"answers": {}},
        headers=auth_headers,
    )
    res = client.post(
        f"/api/v1/mock-tests/attempts/{aid}/submit",
        json={"answers": {}},
        headers=auth_headers,
    )
    assert res.status_code == 400


def test_list_attempts_and_result(client, auth_headers):
    tid = _section_test_id(client, "listening")
    started = client.post(f"/api/v1/mock-tests/{tid}/start", headers=auth_headers).json()
    aid = started["attempt_id"]
    client.post(
        f"/api/v1/mock-tests/attempts/{aid}/submit",
        json={"answers": {}},
        headers=auth_headers,
    )
    attempts = client.get("/api/v1/mock-tests/attempts", headers=auth_headers).json()
    assert any(a["id"] == aid for a in attempts["items"])
    result = client.get(f"/api/v1/mock-tests/attempts/{aid}", headers=auth_headers).json()
    assert result["id"] == aid
    assert result["status"] == "completed"


def test_cannot_access_others_attempt(client, auth_headers, client2):
    tid = _section_test_id(client, "speaking")
    started = client.post(f"/api/v1/mock-tests/{tid}/start", headers=auth_headers).json()
    aid = started["attempt_id"]
    other = client2.get(f"/api/v1/mock-tests/attempts/{aid}", headers=client2.other_headers)
    assert other.status_code in (401, 404)


@pytest.fixture
def client2():
    from fastapi.testclient import TestClient

    from app.main import app

    with TestClient(app) as c:
        c.post(
            "/api/v1/auth/register",
            json={"email": "other@mock.com", "password": "password123"},
        )
        login = c.post(
            "/api/v1/auth/login",
            json={"email": "other@mock.com", "password": "password123"},
        ).json()
        c.other_headers = {"Authorization": f"Bearer {login['access_token']}"}
        yield c
