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
    PixelGroup,
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
class Sphere3Telescope(Telescope):
    name: str = "sphere3"
    display_name: str = "SPHERE 3"

    @property
    def layout(self) -> TelescopeLayout:
        coords = pd.read_csv(
            TELESCOPES_DIR / "sphere3" / "sphere3_coords.dat",
            sep=r"\s+",
        )

        pixels = []
        pixel_groups = []

        for index, row in coords.iterrows():
            group_index = index // 7

            if index % 7 == 0:
                pixel_groups.append(
                    PixelGroup(
                        name=f"{group_index + 1}",
                        x=row["x_module"],
                        y=row["y_module"],
                    )
                )

            pixels.append(
                Pixel(
                    name=f"{index + 1}",
                    x=row["x"],
                    y=row["y"],
                    group=group_index,
                )
            )

        return TelescopeLayout(
            pixel_groups=pixel_groups,
            pixels=pixels,
            pixel_size=5,
            pixel_shape="circle",
        )

    @property
    def event_list(self) -> list[Event]:
        return [Event(name=name, timestamp=0.0) for name in os.listdir(DATA_DIR / "SPHERE3")]

    def parse_event(self, name: str) -> ParsedEvent:
        path = safe_event_path(DATA_DIR / "SPHERE3", name)
        return SphereEvent(pd.read_csv(path, dtype=float))
