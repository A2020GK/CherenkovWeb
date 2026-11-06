from typing import Literal

from .utils import BaseSchema


class Telescope(BaseSchema):
    name: str
    display_name: str

    @property
    def layout(self) -> "TelescopeLayout":
        raise NotImplementedError("Subclasses must implement the 'layout' property.")

    @property
    def event_list(self) -> list["Event"]:
        raise NotImplementedError("Subclasses must implement the 'layout' property.")

    def get_event(self, name: str) -> "EventData":
        raise NotImplementedError("Subclasses must implement the 'get_event' method.")

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
    board: int | None = None # Index

class Pixel(BaseSchema):
    name: str
    x: float
    y: float
    board: int | None = None # Index
    group: int | None = None # Index

class Event(BaseSchema):
    name: str
    timestamp: float

class EventData(BaseSchema):
    data: list[list[float]]
