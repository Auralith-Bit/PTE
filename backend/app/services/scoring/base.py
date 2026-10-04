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


def _is_verbatim_paste(submitted: str, source: str) -> bool:
    """True when `submitted` is the readable source text copied rather than answered.

    Listening study material is deliberately served to the browser so the task can
    render it, and scoring used to read that same transcript as its reference.
    A student could therefore open the network tab, copy the passage into the
    summary box and score full marks without listening to anything.

    A real summary is a compression of its source: markedly shorter, and reusing
    only the load-bearing words. Copying reproduces the source's length and its
    function words too, so those two signals separate an answer from a paste
    without penalising a legitimate answer that happens to quote a phrase.
    """
    if not source.strip() or not submitted.strip():
        return False
    sub_norm = _normalize(submitted)
    src_norm = _normalize(source)
    if not sub_norm or not src_norm:
        return False
    # Cheap reject first: a genuine answer is nowhere near the source's length.
    sub_len, src_len = len(sub_norm.split()), len(src_norm.split())
    if sub_len < src_len * 0.85:
        return False
    if _similarity(sub_norm, src_norm) >= 0.85:
        return True
    # Same content in a different order or punctuation still counts as a copy.
    sub_set, src_set = _word_set(submitted), _word_set(source)
    return len(sub_set & src_set) / len(src_set) >= 0.95


def score_keyword_match(
    submitted: str,
    reference: str,
    max_score: int = 10,
    visible_source: str = "",
) -> ScoreResult:
    if not submitted.strip():
        return ScoreResult(0, max_score, "No answer provided")
    if visible_source and _is_verbatim_paste(submitted, visible_source):
        return ScoreResult(
            0,
            max_score,
            "Response matches the study text verbatim. Summarise it in your own words.",
        )
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
