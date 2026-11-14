import type { TelescopeLayout, Pixel as PixelData } from "../../api/types";

const HEX_ROT = Math.PI / 2;

const HEX_UNIT = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i + HEX_ROT;
  return [Math.cos(a), Math.sin(a)] as const;
});

const hexPoints = (cx: number, cy: number, r: number) =>
  HEX_UNIT.map(([ux, uy]) => `${cx + r * ux},${cy + r * uy}`).join(" ");

export const Pixel = ({
  shape,
  size,
  pixelData,
  fill,
}: {
  shape: TelescopeLayout["pixelShape"];
  size: TelescopeLayout["pixelSize"];
  pixelData: PixelData;
  fill: string;
}) => {
  const renderShape = () => {
    switch (shape) {
      case "hexagon":
        return (
          <polygon
            className="pixel-shape"
            points={hexPoints(pixelData.x, pixelData.y, size)}
            fill={fill}
          />
        );
      case "circle":
        return (
          <circle
            className="pixel-shape"
            cx={pixelData.x}
            cy={pixelData.y}
            r={size}
            fill={fill}
          />
        );
      case "square":
        return (
          <rect
            className="pixel-shape"
            x={pixelData.x - size}
            y={pixelData.y - size}
            width={size * 2}
            height={size * 2}
            fill={fill}
          />
        );
    }
  };

  return (
    <g>
      {renderShape()}
      <text
        x={pixelData.x}
        y={pixelData.y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.8}
        pointerEvents="none"
      >
        {pixelData.name}
      </text>
    </g>
  );
};
