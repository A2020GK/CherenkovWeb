import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { getTelescopeLayout } from "../api/telescope";

export const TelescopeLayout = ({
  telescope,
}: {
  telescope: string | null;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pixelsRef = useRef<SVGGElement | null>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["telescopeLayout", telescope],
    queryFn: () => getTelescopeLayout(telescope!),
    enabled: !!telescope,
    staleTime: "static",
  });

  const applyTransform = () => {
    const el = pixelsRef.current;
    if (!el) return;
    const { x, y, scale } = transformRef.current;
    el.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
  };

  // Runs when <g> mounts so everything is correct,
  // effect would run after the first render which would make UX hell
  const setPixelsRef = (el: SVGGElement | null) => {
    pixelsRef.current = el;
    if (el) {
      const { x, y, scale } = transformRef.current;
      el.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.pixels?.length) {
    return <div>No pixel data</div>;
  }

  const pixelSize = data.pixelSize || 5;
  const padding = pixelSize * 1.5;

  const xs = data.pixels.map((p) => p.x);
  const ys = data.pixels.map((p) => p.y);
  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  // screen (clientX/Y) -> viewBox user space
  const toSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  };

  const handleWheel = (e: React.WheelEvent) => {
    const c = toSvgPoint(e.clientX, e.clientY);
    const factor = Math.exp(-e.deltaY * 0.001);
    const t = transformRef.current;
    const scale = Math.min(10, Math.max(0.1, t.scale * factor));
    const ratio = scale / t.scale;
    transformRef.current = {
      scale,
      x: c.x - ratio * (c.x - t.x),
      y: c.y - ratio * (c.y - t.y),
    };
    applyTransform();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    svgRef.current?.setPointerCapture(e.pointerId);
    const p = toSvgPoint(e.clientX, e.clientY);
    dragRef.current = { x: p.x, y: p.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const p = toSvgPoint(e.clientX, e.clientY);
    const dx = p.x - dragRef.current.x;
    const dy = p.y - dragRef.current.y;
    dragRef.current = { x: p.x, y: p.y };
    const t = transformRef.current;
    transformRef.current = { x: t.x + dx, y: t.y + dy, scale: t.scale };
    applyTransform();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    svgRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleReset = () => {
    transformRef.current = { x: 0, y: 0, scale: 1 };
    applyTransform();
  };

  return (
    <div className="telescope-layout">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <g ref={setPixelsRef} className="pixels">
          {data.pixels.map((pixel, index) => (
            <g key={index}>
              <circle cx={pixel.x} cy={pixel.y} r={pixelSize} fill="black" />
              <text
                x={pixel.x}
                y={pixel.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={pixelSize * 0.8}
                pointerEvents="none"
              >
                {pixel.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
      <button
        type="button"
        className="home-button"
        onClick={handleReset}
        title="Reset view"
      >
        <FontAwesomeIcon icon={faCrosshairs} />
      </button>
    </div>
  );
};