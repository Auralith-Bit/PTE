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
