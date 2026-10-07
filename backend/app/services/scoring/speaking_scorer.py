from __future__ import annotations

import re

from app.services.scoring.base import ScoreResult, score_exact_match, score_keyword_match
from app.services.scoring.summary_scorer import score_summary

# Tasks that capture audio in the browser send only a completion marker, since
# no transcript exists. Recording at least this many seconds earns full credit,
# mirroring the 30-word rule the typed path uses below.
_RECORDED_FULL_CREDIT_SECONDS = 10


def _recorded_score(answer: dict) -> ScoreResult:
    """Completion credit for tasks whose only answer is 'the user recorded'."""
    raw = answer.get("duration_seconds") or 0
    try:
        duration = max(0, int(float(raw)))
    except (TypeError, ValueError):
        duration = 0
    score = 10 if duration >= _RECORDED_FULL_CREDIT_SECONDS else min(8, duration)
    return ScoreResult(score, 10, f"Response recorded ({duration}s)")


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
        if not text and answer.get("recorded"):
            return _recorded_score(answer)
        transcript = content.get("transcript", "")
        text = (answer.get("response") or answer.get("text") or "").strip()
        # `key_points` is the item's aspect list. `notes` is the older
        # single-blob model answer, so split it on sentence boundaries and use
        # it as a fallback aspect list rather than discarding existing rows.
        key_points = content.get("key_points")
        if not key_points and content.get("notes"):
            key_points = [
                s.strip() for s in re.split(r"(?<=[.!?])\s+", content["notes"]) if s.strip()
            ]
        return score_summary(text, key_points=key_points or [], transcript=transcript, max_score=10)

    # Open-ended: completion-based, full score if decodable content provided
    if question_type in ("describe-image", "response-to-a-situation", "personal-introduction"):
        if not text:
            if answer.get("recorded"):
                return _recorded_score(answer)
            return ScoreResult(0, 10, "No response provided")
        word_count = len(text.split())
        if word_count >= 30:
            return ScoreResult(10, 10, "Response recorded")
        return ScoreResult(min(8, word_count), 10, f"Response recorded ({word_count} words)")

    return ScoreResult(0, 10, "Unsupported question type")
