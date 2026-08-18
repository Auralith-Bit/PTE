import logging
import sys

from app.core.config import settings


def setup_logging() -> None:
    level = logging.DEBUG if settings.debug else logging.INFO

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.setLevel(level)
    root.handlers.clear()
    root.addHandler(handler)

    noisy = ("uvicorn.access", "uvicorn.error", "sqlalchemy.engine")
    for name in noisy:
        logging.getLogger(name).setLevel(logging.WARNING)

    logging.getLogger("app").setLevel(level)
