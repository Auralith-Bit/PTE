from __future__ import annotations

from app.services.scoring.base import ScoreResult, score_keyword_match
from app.services.scoring.summary_scorer import score_summary


def _score_multiple_choice(submitted, correct: list) -> ScoreResult:
    if submitted is None or submitted == []:
        return ScoreResult(0, 10, "No selection made")
    selected = [submitted] if not isinstance(submitted, list) else submitted
    if list(selected) == list(correct):
        return ScoreResult(10, 10, "Correct answer")
    return ScoreResult(0, 10, "Incorrect answer")


def _score_blanks(submitted: dict, correct: dict) -> ScoreResult:
    if not submitted:
        return ScoreResult(0, 10, "No answer provided")
    total = len(correct)
    correct_count = 0
    for key, expected in correct.items():
        if str(submitted.get(key, "")).strip().lower() == str(expected).strip().lower():
            correct_count += 1
    score = round(10 * correct_count / total) if total else 0
    return ScoreResult(score, 10, f"{correct_count}/{total} blanks correct")


def score_listening(
    question_type: str,
    content: dict,
    answer: dict,
) -> ScoreResult:
    if question_type == "multiple-choice-single":
        return _score_multiple_choice(answer.get("selected"), content.get("correct", []))
    if question_type == "fill-in-the-blanks":
        return _score_blanks(answer.get("answers", {}), content.get("correct", {}))
    if question_type == "summarize-spoken-test":
        transcript = content.get("transcript", "")
        text = (answer.get("response") or answer.get("text") or "").strip()
        return score_summary(
            text,
            key_points=content.get("key_points") or [],
            transcript=transcript,
            max_score=10,
        )
    return ScoreResult(0, 10, "Unsupported question type")
