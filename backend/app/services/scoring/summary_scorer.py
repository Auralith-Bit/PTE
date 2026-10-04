"""Scoring for the summarising tasks, modelled on the real PTE procedure.

Summarize Spoken Text and Re-tell Lecture are not keyword-match items. The
Pearson specification scores each on five traits worth 0-2 marks each, and the
item total is out of 10:

    Content     2 all relevant aspects mentioned
                1 fair summary, one or two aspects missing
                0 omits or misrepresents the main aspects
    Form        2 contains 50-70 words
                1 contains 40-49 or 71-100 words
                0 under 40 or over 100 words, or written in capitals, with no
                  punctuation, as bullet points, or in very short sentences
    Grammar     2 correct structures / 1 errors with no hindrance / 0 defective
    Vocabulary  2 appropriate / 1 some errors / 0 defective
    Spelling    2 correct / 1 one error / 0 more than one error

Two rules from the specification matter more than the trait list:

- If Content is 0 the whole item is 0, whatever the other traits score. A
  beautifully written summary of the wrong lecture is worth nothing.
- "Responses that contain pre-prepared or memorized material are classified as
  irrelevant responses." Listening transcripts are served to the browser so the
  task UI can render them, so copying one is reachable; the guard in
  `base._is_verbatim_paste` now maps onto that official rule instead of being an
  ad-hoc penalty.

This replaces keyword-overlap scoring, which was measuring the wrong thing. A
valid summary is 50-70 words standing in for 60-90 seconds of speech, so a low
overlap with the source is a *correct* summary, not a weak one. Dividing by the
transcript's full word count made good answers score around 4/10.

Content and Form are checked directly against the published criteria. Grammar
and Vocabulary use conservative surface checks. Spelling cannot be verified
without a dictionary, so it approximates: a token is suspect when it sits one
edit away from a word in the source material. That deliberately under-reports
rather than inventing errors -- a missed misspelling costs a mark, a false
accusation on correct academic vocabulary costs the student two.
"""
from __future__ import annotations

import re

from app.services.scoring.base import ScoreResult, _is_verbatim_paste, _normalize

# Words too common to be evidence of anything, and too likely to appear in a
# hand-written summary to treat as distinctive content.
_FUNCTION_WORDS = frozenset("""
a about above after again against all am an and any are as at be because been
before being below between both but by can cannot could did do does doing down
during each few for from further had has have having he her here hers herself
him himself his how i if in into is it its itself just me more most my myself
no nor not now of off on once only or other our ours ourselves out over own
same she should so some such than that the their theirs them themselves then
there these they this those through to too under until up very was we were
what when where which while who whom why will with would you your yours
yourself yourselves it its they're their there
""".split())

_TERMINAL_PUNCT = ".!?"
_WORD_RE = re.compile(r"[A-Za-z][A-Za-z'-]*")


def _content_words(text: str) -> set[str]:
    return {w for w in _normalize(text).split() if w not in _FUNCTION_WORDS}


def _split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if p.strip()]


def _aspect_covered(aspect: str, submitted_words: set[str]) -> bool:
    """True when the submission conveys enough of an aspect to count it.

    An aspect is a short phrase, so requiring every word would fail on a
    paraphrase. A majority of its distinctive words is the point where the
    aspect is recognisably present: "sleep matters for memory consolidation"
    conveys "sleep plays a critical role in memory consolidation" while
    omitting "plays", "critical" and "role", and must still count as covered.
    """
    words = _content_words(aspect)
    if not words:
        return True
    hits = len(words & submitted_words)
    # Both a ratio and an absolute floor are required. The ratio alone let
    # "sleep helps memory" satisfy half of "sleep is critical for memory
    # consolidation" and collect Grammar and Vocabulary marks, scoring a
    # five-word fragment at 7/10. Three distinct words is the least evidence
    # that an aspect was actually addressed.
    return hits >= 3 and hits / len(words) >= 0.5


def _score_content(text: str, key_points: list[str]) -> tuple[int, str]:
    if not key_points:
        # No key points authored: fall back on length alone rather than awarding
        # or withholding Content on no evidence.
        return (2 if len(text.split()) >= 40 else 0), "no key points to check"
    sub_words = _content_words(text)
    missing = [kp for kp in key_points if not _aspect_covered(kp, sub_words)]
    if not missing:
        return 2, "all key aspects covered"
    # The first key point is the lecture's main claim. Missing it is "omits the
    # main aspects" regardless of how many minor points were hit.
    if not _aspect_covered(key_points[0], sub_words):
        return 0, "main point not covered"
    if len(missing) <= 2:
        return 1, f"{len(missing)} aspect(s) missing"
    return 0, "main aspects omitted"


def _score_form(text: str) -> tuple[int, str]:
    words = len(text.split())
    letters = [c for c in text if c.isalpha()]
    # Capitalisation-only and bullet-only responses score 0 on Form outright.
    if letters and all(c.isupper() for c in letters):
        return 0, "written in capitals"
    stripped = [ln.strip() for ln in text.splitlines() if ln.strip()]
    if stripped and all(ln.lstrip().startswith(("-", "*", "\u2022")) for ln in stripped):
        return 0, "written as bullet points"
    if not any(c in _TERMINAL_PUNCT for c in text):
        return 0, "no sentence punctuation"
    sentences = _split_sentences(text)
    if len(sentences) >= 3 and sum(len(s.split()) for s in sentences) / len(sentences) < 3:
        return 0, "very short sentences"

    if 50 <= words <= 70:
        return 2, f"{words} words (50-70)"
    if 40 <= words <= 100:
        return 1, f"{words} words (outside 50-70)"
    return 0, f"{words} words (under 40 or over 100)"


def _score_grammar(text: str) -> tuple[int, str]:
    sentences = _split_sentences(text)
    if not sentences:
        return 0, "no complete sentences"
    uncapitalised = sum(1 for s in sentences if s[:1].islower())
    unterminated = sum(1 for s in sentences if s[-1] not in _TERMINAL_PUNCT)
    problems = uncapitalised + unterminated
    if problems == 0:
        return 2, "sentences well formed"
    if problems <= 1 or problems / len(sentences) <= 0.34:
        return 1, f"{problems} sentence(s) with errors"
    return 0, f"{problems} of {len(sentences)} sentences defective"


def _score_vocabulary(text: str) -> tuple[int, str]:
    words = [w for w in _normalize(text).split() if w not in _FUNCTION_WORDS]
    if not words:
        return 0, "no content words"
    counts: dict[str, int] = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    top = max(counts.values())
    variety = len(counts) / len(words)
    # Range is the real signal here. A summary has to repeat its topic word --
    # four uses of "sleep" across 31 content words is 13% and entirely normal --
    # so repetition is only penalised when one word genuinely dominates.
    dominance = top / len(words)
    if variety >= 0.6 and dominance <= 0.15:
        return 2, "varied vocabulary"
    if variety >= 0.35:
        return 1, "some repetition"
    return 0, "highly repetitive wording"


def _one_edit_from(token: str, words: set[str]) -> bool:
    """True when `token` looks like a typo of a long word from the source.

    Deliberately narrow, because a false accusation costs the student two marks
    while a missed typo costs one:

    - only same-length substitution or transposition, so plurals and other
      inflections ("days" for "day") are never flagged;
    - only against content words of seven letters or more, which keeps everyday
      short words from matching function words ("band" is one deletion from
      "and", and it is a perfectly good word).
    """
    if len(token) < 7:
        return False
    for candidate in words:
        if len(candidate) != len(token) or len(candidate) < 7:
            continue
        diffs = sum(1 for a, b in zip(candidate, token) if a != b)
        if diffs == 1:
            return True
        if diffs == 2 and candidate[1:-1] == token[1:-1] and candidate[0] == token[-1] \
                and candidate[-1] == token[0]:
            return True  # transposition
    return False


def _score_spelling(text: str, vocabulary: set[str]) -> tuple[int, str]:
    known = vocabulary | _FUNCTION_WORDS
    tokens = [t.lower() for t in _WORD_RE.findall(text)]
    suspect = sorted({t for t in tokens if _one_edit_from(t, known)})
    if not suspect:
        return 2, "no detectable spelling errors"
    if len(suspect) == 1:
        return 1, f"possible misspelling: {suspect[0]}"
    return 0, f"possible misspellings: {', '.join(suspect[:3])}"


def score_summary(
    submitted: str,
    key_points: list[str],
    transcript: str = "",
    max_score: int = 10,
) -> ScoreResult:
    text = (submitted or "").strip()
    if not text:
        return ScoreResult(0, max_score, "No answer provided")

    if transcript and _is_verbatim_paste(text, transcript):
        return ScoreResult(
            0, max_score,
            "Irrelevant response: matches the study text verbatim. "
            "Summarise it in your own words.",
        )

    sub_words = _content_words(text)
    content, content_note = _score_content(text, key_points or [])
    form, form_note = _score_form(text)
    grammar, grammar_note = _score_grammar(text)
    vocabulary, vocabulary_note = _score_vocabulary(text)
    spelling, spelling_note = _score_spelling(
        text, _content_words(transcript) | _content_words(" ".join(key_points or []))
    )

    # Official rule: Content 0 zeroes the item regardless of the other traits.
    if content == 0:
        return ScoreResult(
            0, max_score,
            f"Content 0 ({content_note}) so the item scores 0. "
            "Form, grammar, vocabulary and spelling cannot compensate.",
        )

    total = content + form + grammar + vocabulary + spelling
    detail = (
        f"Content {content}/2 ({content_note}); Form {form}/2 ({form_note}); "
        f"Grammar {grammar}/2 ({grammar_note}); Vocabulary {vocabulary}/2 "
        f"({vocabulary_note}); Spelling {spelling}/2 ({spelling_note})"
    )
    return ScoreResult(min(total, max_score), max_score, detail)