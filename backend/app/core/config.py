from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "PTE-AI Backend"
    app_version: str = "0.1.0"
    debug: bool = False

    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/pte_ai"

    jwt_secret_key: str = "change-me-change-me-change-me-change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 30

    allowed_origins: str = "http://localhost:3000"

    # Password reset. The emailed link points at {frontend_url}/reset-password?token=...
    password_reset_ttl_minutes: int = 60

    # Outbound email. When smtp_host is unset, messages are written to the log
    # instead of being sent, so password reset is testable without a mail server.
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str = "no-reply@pteprep.local"
    smtp_use_starttls: bool = True

    # OAuth (Google / Facebook / Apple sign-in). Each provider is enabled only when
    # the credentials it needs are configured.
    frontend_url: str = "http://localhost:3000"
    backend_public_url: str = "http://localhost:8000"
    google_client_id: str | None = None
    google_client_secret: str | None = None
    facebook_client_id: str | None = None
    facebook_client_secret: str | None = None
    # Sign in with Apple. The client id is the Services ID for the web app. Apple
    # wants a short-lived ES256 JWT as the client secret, so supply the signing key
    # (APPLE_TEAM_ID + APPLE_KEY_ID + the downloaded .p8) rather than a fixed secret.
    apple_client_id: str | None = None
    apple_team_id: str | None = None
    apple_key_id: str | None = None
    # Either paste the .p8 (literal \n escapes are accepted) or point at the file.
    apple_private_key: str | None = None
    apple_private_key_path: str | None = None
    # Optional: a pre-generated client secret JWT, for setups that mint it elsewhere.
    apple_client_secret: str | None = None
    # Apple rejects a client secret valid for more than six months.
    apple_client_secret_ttl_days: int = 180
    # Extra accepted `aud` values, comma separated. A native iOS build signs in with
    # its bundle id rather than the Services ID, so list it here to accept both.
    apple_audiences: str | None = None
    oauth_state_ttl_seconds: int = 600
    oauth_code_ttl_seconds: int = 120

    # Future service config (optional, no defaults needed for dev)
    redis_url: str | None = None
    s3_bucket_name: str | None = None
    openai_api_key: str | None = None
    whisper_model: str = "base"

    @model_validator(mode="after")
    def _validate_secret(self) -> "Settings":
        if self.jwt_secret_key == "change-me-change-me-change-me-change-me":
            import logging

            log = logging.getLogger("app.config")
            log.warning(
                "JWT_SECRET_KEY is using the default value"
                " — set a real secret in .env for production"
            )
        return self

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
