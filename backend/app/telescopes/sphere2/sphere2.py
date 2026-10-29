import pandas as pd
import os

from .. import TELESCOPES_DIR, Pixel, Telescope, TelescopeLayout, register_telescope, DATA_DIR, Event

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