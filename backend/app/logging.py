import logging

# Disable uvicorn loggers before importing FastAPI
logging.getLogger("uvicorn").disabled = True
logging.getLogger("uvicorn.error").disabled = False

# Configure logging for app
formatter = logging.Formatter("%(levelname)s\t%(name)s\t%(message)s\t%(asctime)s", datefmt="%H:%M:%S")
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logging.basicConfig(
    level=logging.DEBUG,
    format="%(levelname)s\t%(name)s\t%(message)s\t%(asctime)s",
    handlers=[
        ch
    ]
)