import { getTelescopeLayout } from "../../api/telescope";
import { getEventData } from "../../api/event";
import { useQuery } from "@tanstack/react-query";
import { usePanZoom } from "./usePanZoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { Pixel } from "./Pixel";
import { Loading } from "../Loading";

export const TelescopeLayout = ({
  telescope,
  eventName,
}: {
  telescope: string | null;
  eventName: string | null;
}) => {
  const {
    svgRef,
    setPixelsRef,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleReset,
  } = usePanZoom();

  const defaultPixelFill = window
    .getComputedStyle(document.querySelector(":root")!)
    .getPropertyValue("--pixel-fill");

  const { data: telescopeLayout, isLoading: isTelescopeLayoutLoading } =
    useQuery({
      enabled: !!telescope,
      queryKey: ["telescopeLayout", telescope],
      queryFn: async () => await getTelescopeLayout(telescope!),
      staleTime: "static",
      // Drop the layout from the memory as soon as it's no longer displayed.
      gcTime: 0,
    });

  const { data: eventData, isLoading: isEventDataLoading } = useQuery({
    enabled: !!telescope && !!eventName,
    queryKey: ["event", telescope, eventName],
    queryFn: async () => await getEventData(telescope!, eventName!),
    staleTime: "static",
    gcTime: 0,
  });

  if (isTelescopeLayoutLoading) {
    return (
      <div className="panel-message">
        <Loading />
      </div>
    );
  }

  if (!telescopeLayout?.pixels?.length) {
    return <div className="panel-message">Нет данных о пикселях</div>;
  }

  const pixelSize = telescopeLayout.pixelSize || 5;
  const padding = pixelSize * 2;

  const xs = telescopeLayout.pixels.map((p) => p.x);
  const ys = telescopeLayout.pixels.map((p) => p.y);
  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

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
        onPointerLeave={handlePointerUp}
      >
        <g ref={setPixelsRef} className="pixels">
          {telescopeLayout.pixels.map((pixel, index) => {
            return (
              <Pixel
                shape={telescopeLayout.pixelShape}
                size={pixelSize}
                pixelData={pixel}
                fill={defaultPixelFill}
                key={index}
              />
            );
          })}
        </g>
      </svg>
      <button
        type="button"
        className="home-button"
        onClick={handleReset}
        title="Сбросить отображение"
      >
        <FontAwesomeIcon icon={faCrosshairs} />
      </button>
    </div>
  );
};
