from __future__ import annotations

import difflib
import re
from dataclasses import dataclass


@dataclass
class ScoreResult:
    score: int
    max_score: int
    feedback: str


def _normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _word_set(text: str) -> set[str]:
    return set(_normalize(text).split())


def _similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def score_exact_match(submitted: str, expected: str, max_score: int = 10) -> ScoreResult:
    norm_sub = _normalize(submitted)
    norm_exp = _normalize(expected)
    if norm_sub == norm_exp:
        return ScoreResult(max_score, max_score, "Exact match")
    ratio = _similarity(norm_sub, norm_exp)
    score = round(max_score * ratio)
    return ScoreResult(score, max_score, f"Partial match ({round(ratio * 100)}% similar)")


def score_keyword_match(
    submitted: str,
    reference: str,
    max_score: int = 10,
) -> ScoreResult:
    if not submitted.strip():
        return ScoreResult(0, max_score, "No answer provided")
    ref_words = _word_set(reference)
    sub_words = _word_set(submitted)
    if not ref_words:
        return ScoreResult(0, max_score, "No reference keywords available")
    overlap = len(ref_words & sub_words)
    if overlap == 0:
        return ScoreResult(0, max_score, "No matching keywords found")
    # Score scales with keyword match proportion relative to meaningful reference words
    ratio = min(1.0, overlap / len(ref_words))
    score = round(max_score * ratio)
    matches = ", ".join(sorted(list(ref_words & sub_words))[:5])
    return ScoreResult(score, max_score, f"Matched keywords: {matches}")
