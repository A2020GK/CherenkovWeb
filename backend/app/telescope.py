from __future__ import annotations

import importlib
import pkgutil
from abc import ABC, abstractmethod
from pathlib import Path
from typing import ClassVar

from .config import config

DATA_DIR = config.data_dir


class BaseEvent(ABC):
    """Base class for events"""

    name: str

    @abstractmethod
    def get_data(self):
        """Return this event's data in a JSON-serializable form."""


class BaseTelescope(ABC):
    """Base class for telescope plugins.

    A plugin declares ``name`` and ``display_name`` and implements
    ``get_events``.
    """

    name: ClassVar[str]
    display_name: ClassVar[str]

    @abstractmethod
    def get_events(self) -> list[BaseEvent]:
        """Return the events recorded by this telescope."""


TELESCOPE_REGISTRY: dict[str, type[BaseTelescope]] = {}


def register_telescope(cls: type[BaseTelescope]) -> type[BaseTelescope]:
    """Class decorator that adds a telescope plugin to the registry."""
    if not getattr(cls, "name", None):
        raise TypeError(f"{cls.__name__} must define a non-empty 'name'")
    if not getattr(cls, "display_name", None):
        raise TypeError(f"{cls.__name__} must define a non-empty 'display_name'")
    if cls.name in TELESCOPE_REGISTRY:
        raise ValueError(f"Telescope {cls.name!r} already registered")

    TELESCOPE_REGISTRY[cls.name] = cls
    return cls


def get_telescope(name: str) -> BaseTelescope:
    """Instantiate the telescope registered under ``name``."""
    try:
        cls = TELESCOPE_REGISTRY[name]
    except KeyError:
        raise ValueError(f"Telescope {name!r} not registered") from None
    return cls()


_loaded = False


def load_telescopes() -> None:
    """Import every plugin module in the ``telescopes`` package."""
    global _loaded
    if _loaded:
        return

    plugins_dir = Path(__file__).parent / "telescopes"
    for module in pkgutil.iter_modules([str(plugins_dir)]):
        if module.name.startswith("_"):
            continue
        importlib.import_module(f"{__package__}.telescopes.{module.name}")

    _loaded = True
