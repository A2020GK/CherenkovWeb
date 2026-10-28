from .utils import BaseSchema


class Telescope(BaseSchema):
    name: str
    display_name: str

    @property
    def layout(self) -> TelescopeLayout:
        raise NotImplementedError("Subclasses must implement the 'layout' property.")

class TelescopeLayout(BaseSchema):
    boards: int = 1
    pixel_groups: list[PixelGroup] | None = None
    pixels: list[Pixel]
    channels: list[str] | None = None

    pixel_size: int
    pixel_group_size: int | None = None

class PixelGroup(BaseSchema):
    name: str
    x: float
    y: float
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
    data: list[float]
