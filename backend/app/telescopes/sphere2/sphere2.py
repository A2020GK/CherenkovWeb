import os

import pandas as pd

from .. import (
    DATA_DIR,
    TELESCOPES_DIR,
    Event,
    EventData,
    Pixel,
    Telescope,
    TelescopeLayout,
    register_telescope,
)


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
            ]
        )

    @property
    def event_list(self) -> list[Event]:
        return [Event(name=name, timestamp=0.0) for name in os.listdir(DATA_DIR / "SPHERE2")]

    def get_event(self, name) -> EventData:
        df = pd.read_csv(DATA_DIR / "SPHERE2" / name)
        data = df.to_numpy(dtype=float).tolist()
        return EventData(data=data)
