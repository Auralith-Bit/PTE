from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


import app.models.attempt  # noqa: E402  (registers Attempt so autogenerate sees it)
import app.models.question  # noqa: E402  (registers Question so autogenerate sees it)
import app.models.user  # noqa: E402,F401  (registers User so autogenerate sees it)
