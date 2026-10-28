import pandas as pd

from .. import TELESCOPES_DIR, Pixel, Telescope, TelescopeLayout, register_telescope


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
