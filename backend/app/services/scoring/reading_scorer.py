from __future__ import annotations

from app.services.scoring.base import ScoreResult


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


def _score_reorder(submitted: list, correct: list) -> ScoreResult:
    if not submitted:
        return ScoreResult(0, 10, "No order provided")
    if list(submitted) == list(correct):
        return ScoreResult(10, 10, "Correct order")
    # Score based on number of correctly placed contiguous segments (LCS)
    total = len(correct)
    if total == 0:
        return ScoreResult(0, 10, "No valid paragraphs")
    matches = sum(1 for i in range(min(len(submitted), total)) if submitted[i] == correct[i])
    score = round(10 * matches / total)
    return ScoreResult(score, 10, f"{matches}/{total} in correct position")


def _score_multiple_choice(submitted, correct: list) -> ScoreResult:
    if submitted is None or submitted == []:
        return ScoreResult(0, 10, "No selection made")
    selected = [submitted] if not isinstance(submitted, list) else submitted
    if list(selected) == list(correct):
        return ScoreResult(10, 10, "Correct answer")
    return ScoreResult(0, 10, "Incorrect answer")


def score_reading(
    question_type: str,
    content: dict,
    answer: dict,
) -> ScoreResult:
    if question_type == "fill-in-the-blanks":
        return _score_blanks(answer.get("answers", {}), content.get("correct", {}))
    if question_type == "re-order-paragraphs":
        return _score_reorder(answer.get("order", []), content.get("order", []))
    if question_type == "multiple-choice-single":
        return _score_multiple_choice(answer.get("selected"), content.get("correct", []))
    return ScoreResult(0, 10, "Unsupported question type")
