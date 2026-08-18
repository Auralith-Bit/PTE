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
