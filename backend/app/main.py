from fastapi import FastAPI

from .logging import *
logger = logging.getLogger(__name__)
logger.info("Starting CherenkovWeb Backend")

from .config import config, ROOT, announce_paths
announce_paths()

from .telescope import load_telescopes
load_telescopes()

app = FastAPI()

from .routers import telescope

@app.get("/")
async def read_root():
    return {"Hello": "World"}

app.include_router(telescope.router)