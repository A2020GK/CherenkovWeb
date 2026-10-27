from __future__ import annotations

import importlib
from collections.abc import Iterator
from pathlib import Path

from .config import config
from .models import Telescope

DATA_DIR = config.data_dir
TELESCOPES_DIR = Path(__file__).parent / "telescopes"


TELESCOPE_REGISTRY: dict[str, type[Telescope]] = {}


def register_telescope(cls: type[Telescope]) -> type[Telescope]:
    """Class decorator that adds a telescope plugin to the registry."""

    name = cls.model_fields["name"].default
    if not isinstance(name, str) or not name:
        raise TypeError(f"{cls.__name__} must set a default 'name'")

    TELESCOPE_REGISTRY[name] = cls
    return cls


def get_telescope(name: str) -> Telescope:
    """Instantiate the telescope registered under ``name``."""
    try:
        cls = TELESCOPE_REGISTRY[name]
    except KeyError:
        raise ValueError(f"Telescope {name!r} not registered") from None
    return cls()


_loaded = False


def _iter_plugin_modules() -> Iterator[str]:
    """Yield the dotted paths of every plugin module, including subfolders."""
    base = f"{__package__}.telescopes"

    for path in sorted(TELESCOPES_DIR.rglob("*.py")):
        parts = list(path.relative_to(TELESCOPES_DIR).with_suffix("").parts)

        if parts[-1] == "__init__":
            parts.pop()
            if not parts:
                # The ``telescopes`` package itself is already imported.
                continue

        if any(part.startswith(("_", ".")) for part in parts):
            continue

        yield ".".join([base, *parts])


def load_telescopes() -> None:
    """Import every plugin module in the ``telescopes`` package."""
    global _loaded
    if _loaded:
        return

    for module_name in _iter_plugin_modules():
        importlib.import_module(module_name)

    _loaded = True
