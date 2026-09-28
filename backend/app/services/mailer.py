"""Outbound email for password reset.

Uses the standard library so the project needs no extra dependency. When no SMTP
host is configured the message is written to the log at INFO with the reset link
on its own line, which keeps the flow usable in development without pretending an
email was sent.
"""
import logging
import smtplib
from email.message import EmailMessage
from email.utils import formataddr

from app.core.config import settings

log = logging.getLogger("app.mailer")

RESET_SUBJECT = "Reset your PTE.Prep password"


def smtp_is_configured() -> bool:
    return bool(settings.smtp_host)


def _build_message(to_email: str, subject: str, body: str) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = formataddr(("PTE.Prep", settings.smtp_from_email))
    message["To"] = to_email
    message.set_content(body)
    return message


def _log_to_console(to_email: str, subject: str, body: str) -> None:
    log.warning("SMTP is not configured; not sending %r to %s", subject, to_email)
    log.warning("--- email to %s ---\n%s", to_email, body)


def send_password_reset(to_email: str, reset_url: str) -> bool:
    """Email a password-reset link. Returns True only if it was really sent."""
    body = (
        f"Hi,\n\n"
        f"We received a request to reset the password for your PTE.Prep account.\n\n"
        f"Choose a new password here:\n{reset_url}\n\n"
        f"This link expires in {settings.password_reset_ttl_minutes} minutes and can only be "
        f"used once. If you did not ask for a reset you can safely ignore this email - "
        f"your password will not change.\n"
    )

    if not smtp_is_configured():
        _log_to_console(to_email, RESET_SUBJECT, body)
        return False

    message = _build_message(to_email, RESET_SUBJECT, body)
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
            if settings.smtp_use_starttls:
                server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)
    except (smtplib.SMTPException, OSError):
        log.exception("Failed to send password reset email to %s", to_email)
        return False

    log.info("Password reset email sent to %s", to_email)
    return True
