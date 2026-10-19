import logging
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


ROOT = Path(__file__).resolve().parents[2]


class Config(BaseSettings):
    """
    Application settings.
    Priority: Env vars -> .env file -> default values
    """

    model_config = SettingsConfigDict(
        env_file=ROOT / ".env", env_file_encoding="utf-8", extra="allow"
    )

    data_dir: Path = Field(default=ROOT / "data")


def announce_paths():
    logger.info("Application root directory: %s", ROOT)
    logger.info("Data directory: %s", config.data_dir)


config = Config()
