import pandas as pd

from .. import TELESCOPES_DIR, Pixel, PixelGroup, Telescope, TelescopeLayout, register_telescope


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
        )
