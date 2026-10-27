import { useQuery } from "@tanstack/react-query";
import { getTelescopeLayout } from "../api/telescope";

export const TelescopeLayout = ({
  telescope,
}: {
  telescope: string | null;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["telescopeLayout", telescope],
    queryFn: () => getTelescopeLayout(telescope!),
    enabled: !!telescope,
    staleTime: "static",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const wh = 400;

  return (
    <div className="telescope-layout">
      <svg viewBox={`0 0 ${wh * 2} ${wh * 2}`} width="100%" height="100%">
        {data?.pixels?.map((pixel, index) => (
          <g key={index}>
            <circle cx={pixel.x + wh} cy={pixel.y + wh} r={5} fill="red" />
          </g>
        ))}
      </svg>
    </div>
  );
};
