from __future__ import annotations

from app.services.scoring.base import ScoreResult, score_exact_match, score_keyword_match


def score_speaking(question_type: str, content: dict, answer: dict) -> ScoreResult:
    """Score a speaking attempt using deterministic local heuristics.
    Open-ended types (describe-image, response-to-a-situation, personal-introduction)
    score on completion; structured types use keyword/exact matching.
    """
    text = (answer.get("response") or answer.get("text") or "").strip()
    if question_type == "answer-short-question":
        expected = content.get("answer", "")
        return score_exact_match(text, expected, max_score=10)

    if question_type == "repeat-sentence":
        expected = content.get("sentence", "")
        return score_exact_match(text, expected, max_score=10)

    if question_type == "read-aloud":
        expected = content.get("text", "")
        return score_keyword_match(text, expected, max_score=10)

    if question_type in ("retell-lecture", "summarize-spoken-test"):
        reference = content.get("notes", "") or content.get("transcript", "")
        return score_keyword_match(text, reference, max_score=10)

    # Open-ended: completion-based, full score if decodable content provided
    if question_type in ("describe-image", "response-to-a-situation", "personal-introduction"):
        if not text:
            return ScoreResult(0, 10, "No response provided")
        word_count = len(text.split())
        if word_count >= 30:
            return ScoreResult(10, 10, "Response recorded")
        return ScoreResult(min(8, word_count), 10, f"Response recorded ({word_count} words)")

    return ScoreResult(0, 10, "Unsupported question type")
