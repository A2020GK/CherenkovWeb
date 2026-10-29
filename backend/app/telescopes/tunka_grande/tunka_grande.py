import pandas as pd

from .. import TELESCOPES_DIR, Pixel, Telescope, TelescopeLayout, register_telescope


@register_telescope
class TunkaGrande(Telescope):
    name: str = "tunka_grande"
    display_name: str = "Tunka-Grande"

    @property
    def layout(self):
        coords = pd.read_csv(
            TELESCOPES_DIR / "tunka_grande" / "tunka_grande_coords.txt",
            sep=r"\s+",
        )

        pixels = [
            Pixel(
                name=str(index + 1),
                x=float(row["X_el"]),
                y=float(row["Y_el"]),
            )
            for index, row in coords.iterrows()
        ]

        return TelescopeLayout(
            pixels=pixels,
            pixel_size=75,
            pixel_shape="circle",
            channels=[f"ch{i+1}" for i in range(16)]
        )
