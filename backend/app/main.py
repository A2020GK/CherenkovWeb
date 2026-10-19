import logging

from fastapi import FastAPI

from . import logging as app_logging  # noqa: F401  # configures logging on import
from .config import announce_paths
from .routers import telescope
from .telescope import load_telescopes

logger = logging.getLogger(__name__)
logger.info("Starting CherenkovWeb Backend")

announce_paths()
load_telescopes()

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


app.include_router(telescope.router)
