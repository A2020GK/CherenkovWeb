import { useRef } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  RefObject,
  WheelEvent as ReactWheelEvent,
} from "react";
import {
  panBy,
  screenToSvgPoint,
  toTransformAttribute,
  zoomAt,
  type Transform,
} from "./geometry";

const DEFAULT_TRANSFORM: Transform = { x: 0, y: 0, scale: 1 };

export interface PanZoom {
  svgRef: RefObject<SVGSVGElement | null>;
  setPixelsRef: (el: SVGGElement | null) => void;
  handleWheel: (e: ReactWheelEvent<SVGSVGElement>) => void;
  handlePointerDown: (e: ReactPointerEvent<SVGSVGElement>) => void;
  handlePointerMove: (e: ReactPointerEvent<SVGSVGElement>) => void;
  handlePointerUp: (e: ReactPointerEvent<SVGSVGElement>) => void;
  handleReset: () => void;
}

/**
 * Pan/zoom state for an SVG. The transform is written straight to the DOM
 */
export const usePanZoom = (
  initialTransform: Transform = DEFAULT_TRANSFORM,
): PanZoom => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pixelsRef = useRef<SVGGElement | null>(null);
  const initialRef = useRef<Transform>(initialTransform);
  const transformRef = useRef<Transform>({ ...initialTransform });
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const applyTransform = () => {
    const el = pixelsRef.current;
    if (el) {
      el.setAttribute("transform", toTransformAttribute(transformRef.current));
    }
  };

  // Callback ref, so the transform is applied as soon as <g> mounts
  const setPixelsRef = (el: SVGGElement | null) => {
    pixelsRef.current = el;
    if (el) {
      el.setAttribute("transform", toTransformAttribute(transformRef.current));
    }
  };

  const eventToSvgPoint = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current;
    return svg ? screenToSvgPoint(svg, e.clientX, e.clientY) : null;
  };

  const handleWheel = (e: ReactWheelEvent<SVGSVGElement>) => {
    const anchor = eventToSvgPoint(e);
    if (!anchor) return;

    transformRef.current = zoomAt(transformRef.current, anchor, e.deltaY);
    applyTransform();
  };

  const handlePointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    const anchor = eventToSvgPoint(e);
    if (!anchor) return;

    svgRef.current?.setPointerCapture(e.pointerId);
    dragRef.current = { x: anchor.x, y: anchor.y };
  };

  const handlePointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const point = eventToSvgPoint(e);
    if (!point) return;

    const dx = point.x - drag.x;
    const dy = point.y - drag.y;
    dragRef.current = { x: point.x, y: point.y };
    transformRef.current = panBy(transformRef.current, dx, dy);
    applyTransform();
  };

  const handlePointerUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    dragRef.current = null;

    const svg = svgRef.current;
    if (svg?.hasPointerCapture(e.pointerId)) {
      svg.releasePointerCapture(e.pointerId);
    }
  };

  const handleReset = () => {
    transformRef.current = { ...initialRef.current };
    applyTransform();
  };

  return {
    svgRef,
    setPixelsRef,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleReset,
  };
};
