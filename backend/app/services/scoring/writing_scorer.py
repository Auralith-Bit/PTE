from __future__ import annotations

from app.services.scoring.base import ScoreResult, score_keyword_match


def score_writing(question_type: str, content: dict, answer: dict) -> ScoreResult:
    """Score a writing attempt using deterministic local heuristics.
    Uses keyword coverage for summarize + length-based heuristics for essays.
    (LLM-based scoring will replace this later.)
    """
    text = (answer.get("response") or answer.get("text") or "").strip()
    if question_type == "summarize-written-text":
        reference = content.get("passage", "")
        return score_keyword_match(text, reference, max_score=10)
    if question_type == "essay":
        word_count = len(text.split())
        if word_count < 120:
            return ScoreResult(min(4, word_count // 30), 10, "Essay is too short")
        ref_words = set(reference_keywords(content.get("prompt", "")))
        sub_words = set(_lower_words(text))
        overlap = len(ref_words & sub_words)
        ratio = min(1.0, (overlap + 0.2) / 1.0)
        score = round(10 * min(1.0, ratio + 0.25 * min(1.0, word_count / 250)))
        return ScoreResult(min(10, score), 10, "Essay scored on length and topic coverage")
    return ScoreResult(0, 10, "Unsupported question type")


def _lower_words(text: str) -> list[str]:
    import re

    return re.findall(r"\b[a-z0-9]+\b", text.lower())


def reference_keywords(prompt: str) -> list[str]:
    if not prompt:
        return []
    stopwords = {
        "the", "a", "an", "to", "of", "in", "for", "and", "or",
        "on", "with", "is", "are", "be", "this", "that",
    }
    words = _lower_words(prompt)
    return [w for w in words if w not in stopwords]
