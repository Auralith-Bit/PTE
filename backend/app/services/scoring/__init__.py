from __future__ import annotations

from app.services.scoring.base import ScoreResult
from app.services.scoring.listening_scorer import score_listening
from app.services.scoring.reading_scorer import score_reading
from app.services.scoring.speaking_scorer import score_speaking
from app.services.scoring.writing_scorer import score_writing

_SCORERS = {
    "speaking": score_speaking,
    "writing": score_writing,
    "reading": score_reading,
    "listening": score_listening,
}


def score_submission(category: str, question_type: str, content: dict, answer: dict) -> ScoreResult:
    scorer = _SCORERS.get(category)
    if scorer is None:
        return ScoreResult(0, 10, "Unsupported category")
    return scorer(question_type, content, answer)
