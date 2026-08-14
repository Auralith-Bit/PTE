# PTE-AI Backend

API and AI scoring services for the PTE-AI exam practice platform — built with FastAPI.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| FastAPI | High-performance async web framework |
| Python 3.11+ | Runtime language |
| Uvicorn | ASGI server |
| SQLAlchemy 2.0 | ORM and database access |
| Alembic | Database migrations |
| PostgreSQL | Primary database |
| Pydantic v2 | Request/response validation and schemas |
| Celery | Background task queue (audio processing, scoring) |
| Redis | Celery broker and cache |
| JWT (PyJWT) | Stateless authentication and authorization |
| OpenAI Whisper | Speech-to-text transcription |
| LLM API (e.g. OpenAI) | AI-powered answer evaluation |
| Boto3 (AWS S3) | Object storage for audio uploads |
| pytest | Unit and integration testing |

## Project Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app entry point
│   ├── api/
│   │   ├── router.py            # Central router aggregation
│   │   └── routers/             # Auth, speaking, writing, reading, listening, mock_test, score, payments
│   ├── core/
│   │   ├── config.py            # App settings (pydantic-settings)
│   │   ├── database.py          # Database engine/connection
│   │   └── security.py          # Password hashing, JWT helpers
│   ├── db/
│   │   ├── base.py              # Declarative base + model registry
│   │   ├── init_db.py           # Initial data seeding
│   │   └── session.py           # DB session dependency
│   ├── models/                  # SQLAlchemy models: user, question, attempt, subscription
│   ├── schemas/                 # Pydantic schemas: user, practice, feedback
│   ├── services/
│   │   ├── ai/                  # whisper_service, pronunciation_service, fluency_service, llm_scoring_service
│   │   ├── scoring/             # speaking_scorer, writing_scorer, reading_scorer, listening_scorer
│   │   ├── storage/             # s3_service
│   │   └── audio_service.py     # Audio processing helpers
│   └── tasks/
│       ├── celery_app.py        # Celery app + Redis broker
│       ├── audio_processing.py  # Async audio jobs
│       └── scoring_tasks.py     # Async scoring jobs
├── alembic/                     # Migration scripts
├── tests/                       # pytest suite
├── .env.example
├── pyproject.toml
└── requirements.txt
```

## API Base URL

All endpoints are served under `/api/v1`.

| Area | Route Prefix | Description |
|------|-------------|-------------|
| Auth | `/api/v1/auth` | Register, login, token refresh |
| Speaking | `/api/v1/speaking` | Speaking practice + AI scoring |
| Writing | `/api/v1/writing` | Writing practice + AI scoring |
| Reading | `/api/v1/reading` | Reading practice + scoring |
| Listening | `/api/v1/listening` | Listening practice + scoring |
| Mock Test | `/api/v1/mock-test` | Full exam simulation |
| Score | `/api/v1/score` | Score retrieval and analytics |
| Payments | `/api/v1/payments` | Subscriptions and billing |

## Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL
- Redis

### Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Run migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive Swagger UI.

### Run Celery workers

```bash
celery -A app.tasks.celery_app worker --loglevel=info
```

### Run Tests

```bash
pytest
```

## Environment Variables

Create `backend/.env`:

```
DATABASE_URL=postgresql+psycopg://user:pass@localhost:5432/pte_ai
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
S3_BUCKET_NAME=pte-ai-audio
OPENAI_API_KEY=
WHISPER_MODEL=base
```

## License

MIT



Environment scan complete. Here's the situation and plan.

Environment findings

- Installed already: fastapi 0.136.1, uvicorn 0.46, pydantic 2.13.4, sqlalchemy 2.0.49, psycopg2 2.9.12, pyjwt, passlib ✓
- Missing: alembic (migrations), redis/docker (not needed yet)
- PostgreSQL 18 running on localhost:5432 — but no .env, no pgpass, no PGPASSWORD; the postgres user requires a password I don't have
- alembic/versions/ exists but is empty; all backend files are 0-byte placeholders
Plan — Phase 0: Foundation + Database integration
Deferred to later (per your direction): AI scoring (Whisper/LLM) and payments.


Step 1 — venv + dependencies
- Create backend/.venv, write requirements.txt (fastapi, uvicornstandard, sqlalchemy, psycopg2-binary, pydantic-settings, alembic, python-jose or pyjwt, passlibbcrypt, pytest, ruff)
- Install alembic (missing today)

Step 2 — Config
- app/core/config.py — pydantic-settings: DATABASE_URL, JWT_SECRET_KEY, etc.
- .env.example populated; .env created (gitignored)

Step 3 — Database layer
- app/core/database.py — SQLAlchemy 2.0 engine + session factory
- app/db/session.py — get_db dependency
- app/db/base.py — declarative base + model import registry

Step 4 — Alembic setup
- alembic init, alembic.ini, env.py wired to config
- First migration (empty baseline) + verify alembic upgrade head works against live PG

Step 5 — User model + first migration
- app/models/user.py — users table (id, email, password_hash, name, created_at)
- Auto-generate migration, apply it, verify table via \dt
- app/schemas/user.py — Register/Login/UserOut Pydantic schemas

Step 6 — Auth (small vertical slice, proves DB end-to-end)
- app/core/security.py — bcrypt hashing + JWT access/refresh
- app/api/routers/auth.py — POST /register, /login, /refresh, GET /me
- app/api/router.py — mount under /api/v1
- app/main.py — FastAPI app + CORS + router include
- tests/test_auth.py — register→login→me round-trip

Step 7 — Verify
- pytest green; uvicorn app.main:app --reload → Swagger at /docs, hit register/login with curl

Blockers I need from you
1. PostgreSQL password for the postgres user (or a DB/user/credentials you want me to use) — required to apply migrations.
2. Confirm interpretation: "we will start from AI work" — I read this as start with foundation/database first (AI scoring + payments later). Is that right, or do you want DB setup AND the AI scoring service built together in this pass?