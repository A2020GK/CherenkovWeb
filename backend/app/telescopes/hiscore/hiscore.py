import pandas as pd

from .. import TELESCOPES_DIR, Pixel, Telescope, TelescopeLayout, register_telescope


@register_telescope
class HiSCORETelescope(Telescope):
    name: str = "hiscore"
    display_name: str = "HiSCORE"

    @property
    def layout(self) -> TelescopeLayout:
        coords = pd.read_csv(
            TELESCOPES_DIR / "hiscore" / "hiscore_coords.txt",
            sep=r"\s+",
            header=None,
        )

        pixels = []
        for _, row in coords.iterrows():


            pixels.append(
                Pixel(
                    name=str(int(row[0])),
                    x=-row[2],
                    y=-row[1],
                )
            )

        return TelescopeLayout(
            pixels=pixels,
            pixel_size=50,
            pixel_shape="circle",
            channels=["a1", "a2", "a3", "a4", "d1", "d2", "d3", "d4", "trigger"]
        )
