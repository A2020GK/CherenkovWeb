from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..telescopes import BaseTelescope


@dataclass(frozen=True)
class TelescopeEntry:
    """A registered telescope: its identifier, public display name, and class."""
    name: str
    display_name: str
    cls: type[BaseTelescope]


TELESCOPE_REGISTRY: dict[str, TelescopeEntry] = {}


def register_telescope(name: str, display_name: str) -> Callable[[type[BaseTelescope]], type[BaseTelescope]]:
    """Register a telescope class under ``name`` with a public ``display_name``."""
    def decorator(cls: type[BaseTelescope]) -> type[BaseTelescope]:
        if name in TELESCOPE_REGISTRY:
            raise ValueError(f"Telescope {name!r} already registered")
        TELESCOPE_REGISTRY[name] = TelescopeEntry(name=name, display_name=display_name, cls=cls)
        return cls
    return decorator


def get_telescope(name: str) -> BaseTelescope:
    """Instantiate and return the telescope registered under ``name``."""
    try:
        entry = TELESCOPE_REGISTRY[name]
    except KeyError:
        raise ValueError(f"Telescope {name!r} not registered") from None
    return entry.cls()
