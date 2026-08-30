import pytest

from app.core.database import SessionLocal
from app.models.question import Question


@pytest.fixture
def auth_headers(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "solver@example.com", "password": "password123", "full_name": "Solver"},
    )
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "solver@example.com", "password": "password123"},
    ).json()
    return {"Authorization": f"Bearer {login['access_token']}"}


def _find_question(category: str, qtype: str) -> dict:
    session = SessionLocal()
    try:
        q = session.query(Question).filter_by(category=category, type=qtype).first()
        assert q is not None, f"No {category}/{qtype} question in DB"
        return {"id": q.id, "content": q.content}
    finally:
        session.close()


def test_submit_requires_auth(client):
    res = client.post(
        "/api/v1/reading/submit",
        json={"question_id": 1, "answer": {}},
    )
    assert res.status_code == 401


def test_submit_answer_short_question_exact(client, auth_headers):
    q = _find_question("speaking", "answer-short-question")
    res = client.post(
        "/api/v1/speaking/submit",
        json={"question_id": q["id"], "answer": {"response": q["content"]["answer"]}},
        headers=auth_headers,
    )
    assert res.status_code == 200
    body = res.json()
    assert body["score"] == 10
    assert body["max_score"] == 10
    assert body["correct"] is True
    assert body["attempt_id"] > 0


def test_submit_answer_short_question_wrong(client, auth_headers):
    q = _find_question("speaking", "answer-short-question")
    res = client.post(
        "/api/v1/speaking/submit",
        json={"question_id": q["id"], "answer": {"response": "definitely not the answer"}},
        headers=auth_headers,
    )
    body = res.json()
    assert body["score"] < 10
    assert body["correct"] is False


def test_submit_multiple_choice_correct(client, auth_headers):
    q = _find_question("reading", "multiple-choice-single")
    correct_index = q["content"]["correct"][0]
    res = client.post(
        "/api/v1/reading/submit",
        json={"question_id": q["id"], "answer": {"selected": correct_index}},
        headers=auth_headers,
    )
    assert res.status_code == 200
    body = res.json()
    assert body["score"] == 10
    assert body["correct"] is True


def test_submit_fill_blanks_partial(client, auth_headers):
    q = _find_question("listening", "fill-in-the-blanks")
    correct = q["content"]["correct"]
    answers = dict(correct)
    answers["2"] = "wrong-answer"
    res = client.post(
        "/api/v1/listening/submit",
        json={"question_id": q["id"], "answer": {"answers": answers}},
        headers=auth_headers,
    )
    body = res.json()
    blank_total = len(correct)
    expected = round(10 / blank_total)
    assert body["score"] == expected
    assert body["correct"] is False


def test_submit_reorder_paragraphs_wrong(client, auth_headers):
    q = _find_question("reading", "re-order-paragraphs")
    reverse = list(reversed(q["content"]["order"]))
    res = client.post(
        "/api/v1/reading/submit",
        json={"question_id": q["id"], "answer": {"order": reverse}},
        headers=auth_headers,
    )
    body = res.json()
    assert body["score"] >= 0
    assert isinstance(body["feedback"], str)


def test_submit_unknown_question_404(client, auth_headers):
    res = client.post(
        "/api/v1/speaking/submit",
        json={"question_id": 999999, "answer": {"response": "anything"}},
        headers=auth_headers,
    )
    assert res.status_code == 404


def test_submit_wrong_category_question_404(client, auth_headers):
    q = _find_question("reading", "multiple-choice-single")
    res = client.post(
        "/api/v1/speaking/submit",
        json={"question_id": q["id"], "answer": {"response": "nope"}},
        headers=auth_headers,
    )
    assert res.status_code == 404


def test_dashboard_updates_after_submit(client, auth_headers):
    q = _find_question("speaking", "answer-short-question")
    client.post(
        "/api/v1/speaking/submit",
        json={"question_id": q["id"], "answer": {"response": q["content"]["answer"]}},
        headers=auth_headers,
    )
    res = client.get("/api/v1/dashboard/summary", headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert body["questions_solved"] >= 1
    assert isinstance(body["recent_activity"], list)
    assert len(body["recent_activity"]) >= 1
