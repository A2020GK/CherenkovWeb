from abc import ABC, abstractmethod
from typing import Literal

from .utils import BaseSchema

type EventSummary = list[float]
type EventWaveform = list[list[float]]
type EventData = list[list[list[float]]]


class ParsedEvent(ABC):
    """A plugin-specific parsed event, cached per telescope and event name."""

    _summary: EventSummary | None = None

    @abstractmethod
    def event(self) -> EventData:
        """Return the full event data."""

    @abstractmethod
    def waveform(self, pixel: int) -> EventWaveform:
        """Return all channels for a single pixel."""

    @abstractmethod
    def compute_summary(self) -> EventSummary:
        """Compute the per-pixel summary."""

    def summary(self) -> EventSummary:
        if self._summary is None:
            self._summary = self.compute_summary()
        return self._summary


class Telescope(BaseSchema, ABC):
    name: str
    display_name: str

    @property
    @abstractmethod
    def layout(self) -> "TelescopeLayout":
        """Return the telescope layout."""

    @property
    def event_list(self) -> list["Event"]:
        raise NotImplementedError("Subclasses must implement the 'event_list' property.")

    def parse_event(self, name: str) -> ParsedEvent:
        raise NotImplementedError("Subclasses must implement the 'parse_event' method.")

    def _load_event(self, name: str) -> ParsedEvent:
        from .telescope import load_event

        return load_event(self.name, name)

    def get_event(self, name: str) -> EventData:
        return self._load_event(name).event()

    def get_summary(self, name: str) -> EventSummary:
        return self._load_event(name).summary()

    def get_waveform(self, name: str, pixel: int) -> EventWaveform:
        return self._load_event(name).waveform(pixel)


class TelescopeLayout(BaseSchema):
    boards: int = 1
    pixel_groups: list["PixelGroup"] | None = None
    pixels: list["Pixel"]
    channels: list[str] | None = None

    pixel_size: float | None = None
    pixel_group_size: float | None = None
    pixel_shape: Literal["circle", "hexagon", "square"]


class PixelGroup(BaseSchema):
    name: str
    x: float | None = None
    y: float | None = None
    board: int | None = None  # Index


class Pixel(BaseSchema):
    name: str
    x: float
    y: float
    board: int | None = None  # Index
    group: int | None = None  # Index


class Event(BaseSchema):
    name: str
    timestamp: float
