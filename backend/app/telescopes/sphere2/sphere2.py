import os

import pandas as pd

from .. import (
    DATA_DIR,
    TELESCOPES_DIR,
    Event,
    EventData,
    EventSummary,
    EventWaveform,
    ParsedEvent,
    Pixel,
    Telescope,
    TelescopeLayout,
    register_telescope,
    safe_event_path,
)


class SphereEvent(ParsedEvent):
    def __init__(self, frame: pd.DataFrame):
        self._frame = frame

    def event(self) -> EventData:
        data: EventData = self._frame.to_numpy(dtype=float).T[:, None, :].tolist()
        return data

    def compute_summary(self) -> EventSummary:
        summary: EventSummary = self._frame.abs().max(axis=0).tolist()
        return summary

    def waveform(self, pixel: int) -> EventWaveform:
        if pixel < 0:
            raise IndexError(pixel)
        waveform: EventWaveform = [self._frame.iloc[:, pixel].tolist()]
        return waveform


@register_telescope
class Sphere2Telescope(Telescope):
    name: str = "sphere2"
    display_name: str = "SPHERE 2"

    @property
    def layout(self) -> TelescopeLayout:
        coords = pd.read_csv(
            TELESCOPES_DIR / "sphere2" / "sphere2_coords.txt",
            sep=r"\s+",
        )

        return TelescopeLayout(
            pixel_size=20,
            pixel_shape="circle",
            pixels=[
                Pixel(
                    name=f"{row['ch']:g}",
                    x=row["x"],
                    y=row["y"],
                )
                for _, row in coords.iterrows()
            ],
        )

    @property
    def event_list(self) -> list[Event]:
        return [Event(name=name, timestamp=0.0) for name in os.listdir(DATA_DIR / "SPHERE2")]

    def parse_event(self, name: str) -> ParsedEvent:
        path = safe_event_path(DATA_DIR / "SPHERE2", name)
        return SphereEvent(pd.read_csv(path, dtype=float))
