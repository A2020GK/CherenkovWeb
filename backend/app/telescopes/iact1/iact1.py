import pandas as pd

from .. import TELESCOPES_DIR, Pixel, PixelGroup, Telescope, TelescopeLayout, register_telescope


@register_telescope
class IACT1Telescope(Telescope):
    name: str = "iact1"
    display_name: str = "IACT1"

    @property
    def layout(self) -> TelescopeLayout:
        coords = TELESCOPES_DIR / "iact1" / "iact1_coords.csv"
        df = pd.read_csv(coords)

        pixel_groups = {}
        pixels = []

        for _, row in df.iterrows():
            if row["cluster_number"] not in pixel_groups:
                pixel_groups[row["cluster_number"]] = PixelGroup(
                    name=str(int(row['cluster_number'])),
                )
            pixels.append(Pixel(
                name=str(int(row['pixel_number'])),
                x=row['x'],
                y=row['y'],
                group=list(pixel_groups.keys()).index(row['cluster_number'])
            ))

        return TelescopeLayout(
            pixel_groups=list(pixel_groups.values()),
            pixels=pixels,
            pixel_size=1.65,
            pixel_group_size=1,
            pixel_shape="hexagon"
        )
