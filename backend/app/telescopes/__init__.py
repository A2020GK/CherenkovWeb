import importlib
import pkgutil
from abc import ABC, abstractmethod


class BaseTelescope(ABC):
    """Base class for all telescopes."""
    # heatmap, plot configuration


def import_telescopes() -> None:
    """Import every module in this package so their registration decorators run."""
    for module in pkgutil.iter_modules(__path__):
        if module.name.startswith("_"):
            continue
        importlib.import_module(f"{__name__}.{module.name}")


import_telescopes()
