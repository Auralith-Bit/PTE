"""Short-lived, single-use codes for handing a fresh session to the browser.

After a successful OAuth callback the browser is redirected to the frontend with
an opaque code instead of real tokens, so credentials never land in a URL, in
browser history, or in a Referer header. The frontend exchanges the code for a
normal token pair over XHR.

Entries live in process memory, so a code issued by one worker is not visible to
another. That is fine for the single-process dev server; a multi-worker or
multi-instance deployment must move this into Redis (redis_url is already a
config option) or a table.
"""
import secrets
import threading
import time
from dataclasses import dataclass

CODE_BYTES = 32


@dataclass(frozen=True)
class ExchangeCode:
    user_id: int
    next_path: str


_lock = threading.Lock()
_codes: dict[str, tuple[ExchangeCode, float]] = {}


def _purge_expired(now: float) -> None:
    expired = [code for code, (_, expires_at) in _codes.items() if expires_at <= now]
    for code in expired:
        del _codes[code]


def issue_code(user_id: int, next_path: str, ttl_seconds: int) -> str:
    now = time.monotonic()
    with _lock:
        _purge_expired(now)
        code = secrets.token_urlsafe(CODE_BYTES)
        _codes[code] = (ExchangeCode(user_id=user_id, next_path=next_path), now + ttl_seconds)
    return code


def consume_code(code: str) -> ExchangeCode | None:
    """Return the code's payload and invalidate it. Returns None if unknown or expired."""
    now = time.monotonic()
    with _lock:
        entry = _codes.pop(code, None)
    if entry is None:
        return None
    payload, expires_at = entry
    if expires_at <= now:
        return None
    return payload
