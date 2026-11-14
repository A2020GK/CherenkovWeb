export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export interface Point {
  x: number;
  y: number;
}

export const MIN_SCALE = 0.1;
export const MAX_SCALE = 10;

const ZOOM_SPEED = 0.001;

export const clampScale = (scale: number) =>
  Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

/**
 * Converts screen coordinates (clientX/clientY) to the SVG's user space,
 */
export const screenToSvgPoint = (
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): DOMPoint => {
  const ctm = svg.getScreenCTM();
  if (!ctm) {
    throw new Error("Cannot map screen coordinates: SVG is not rendered");
  }

  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(ctm.inverse());
};

/**
 * Zooms around `anchor` (a point in SVG user space) so the content under the
 * cursor stays in place.
 */
export const zoomAt = (
  transform: Transform,
  anchor: Point,
  deltaY: number,
): Transform => {
  const scale = clampScale(transform.scale * Math.exp(-deltaY * ZOOM_SPEED));
  const ratio = scale / transform.scale;

  return {
    scale,
    x: anchor.x - ratio * (anchor.x - transform.x),
    y: anchor.y - ratio * (anchor.y - transform.y),
  };
};

export const panBy = (
  transform: Transform,
  dx: number,
  dy: number,
): Transform => ({
  x: transform.x + dx,
  y: transform.y + dy,
  scale: transform.scale,
});

export const toTransformAttribute = ({ x, y, scale }: Transform): string =>
  `translate(${x} ${y}) scale(${scale})`;

/** viewBox that fits all points with the given padding around the edges. */
export const computeViewBox = (
  points: readonly Point[],
  padding: number,
): string => {
  if (!points.length) {
    return "0 0 1 1";
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
};
