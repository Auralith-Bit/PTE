import pytest

from app.core.database import SessionLocal
from app.db.seed_data import build_seed_questions
from app.models.question import Question

ANSWER_KEYS = ("correct", "correct_answer", "answer", "answers", "order")


@pytest.fixture(scope="session", autouse=True)
def _seed_test_questions():
    session = SessionLocal()
    try:
        for q in build_seed_questions():
            session.add(
                Question(
                    category=q["category"],
                    type=q["type"],
                    difficulty=q["difficulty"],
                    content=q["content"],
                )
            )
        session.commit()
    finally:
        session.close()


def _assert_no_answers(content: dict) -> None:
    for key in ANSWER_KEYS:
        assert key not in content, f"Answer key '{key}' leaked in content"


class TestSpeakingQuestions:
    def test_list_all_speaking_questions(self, client):
        res = client.get("/api/v1/speaking/questions")
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == 80
        assert len(data["items"]) == 20
        assert all(q["category"] == "speaking" for q in data["items"])

    def test_speaking_questions_never_expose_answers(self, client):
        res = client.get("/api/v1/speaking/questions", params={"limit": 100})
        for q in res.json()["items"]:
            _assert_no_answers(q["content"])

    def test_filter_by_type(self, client):
        res = client.get("/api/v1/speaking/questions", params={"type": "answer-short-question"})
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == 10
        assert all(q["type"] == "answer-short-question" for q in data["items"])

    @pytest.mark.parametrize(
        "task_type",
        [
            "summarize-spoken-test",
            "response-to-a-situation",
            "personal-introduction",
        ],
    )
    def test_new_speaking_types_return_questions(self, client, task_type):
        res = client.get("/api/v1/speaking/questions", params={"type": task_type, "limit": 100})
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == 10
        assert len(data["items"]) == 10
        assert all(q["type"] == task_type for q in data["items"])
        for q in data["items"]:
            _assert_no_answers(q["content"])

    def test_filter_by_difficulty(self, client):
        res = client.get("/api/v1/speaking/questions", params={"difficulty": "hard"})
        assert res.status_code == 200
        assert res.json()["total"] == 10

    def test_pagination(self, client):
        res = client.get("/api/v1/speaking/questions", params={"limit": 5, "offset": 5})
        data = res.json()
        assert len(data["items"]) == 5
        assert data["total"] == 80

    def test_random_returns_distinct(self, client):
        res1 = client.get("/api/v1/speaking/questions", params={"random": True, "limit": 3})
        res2 = client.get("/api/v1/speaking/questions", params={"random": True, "limit": 3})
        assert res1.status_code == 200
        assert res2.status_code == 200

    def test_get_single_question_strips_answers(self, client):
        listing = client.get(
            "/api/v1/speaking/questions",
            params={"type": "answer-short-question", "limit": 1},
        ).json()
        qid = listing["items"][0]["id"]
        res = client.get(f"/api/v1/speaking/questions/{qid}")
        assert res.status_code == 200
        body = res.json()
        assert body["id"] == qid
        _assert_no_answers(body["content"])
        assert "question" in body["content"]

    def test_get_unknown_question_404(self, client):
        res = client.get("/api/v1/speaking/questions/999999")
        assert res.status_code == 404

    def test_cross_category_404(self, client):
        reading = client.get("/api/v1/reading/questions", params={"limit": 1}).json()
        qid = reading["items"][0]["id"]
        res = client.get(f"/api/v1/speaking/questions/{qid}")
        assert res.status_code == 404


class TestOtherCategories:
    @pytest.mark.parametrize(
        "category,expected_total",
        [("writing", 4), ("reading", 4), ("listening", 4)],
    )
    def test_list_category(self, client, category, expected_total):
        res = client.get(f"/api/v1/{category}/questions", params={"limit": 100})
        assert res.status_code == 200
        data = res.json()
        assert data["total"] == expected_total
        assert all(q["category"] == category for q in data["items"])
        for q in data["items"]:
            _assert_no_answers(q["content"])

    def test_reading_multiple_choice_keeps_options_but_not_correct(self, client):
        res = client.get("/api/v1/reading/questions", params={"type": "multiple-choice-single", "limit": 1})
        item = res.json()["items"][0]
        assert "options" in item["content"]
        assert "correct" not in item["content"]

    def test_unknown_type_returns_422(self, client):
        res = client.get("/api/v1/writing/questions", params={"type": "does-not-exist"})
        assert res.status_code == 422
