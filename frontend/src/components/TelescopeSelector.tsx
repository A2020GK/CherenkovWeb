import { useQuery } from "@tanstack/react-query";
import { getTelescopes } from "../api/telescope";

export const TelescopeSelector = ({
  telescope,
  setTelescope,
}: {
  telescope: string | null;
  setTelescope: (telescope: string | null) => void;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["telescopes"],
    queryFn: getTelescopes,
  });

  return (
    <div>
      <select
        value={telescope ?? ""}
        onChange={(e) => setTelescope(e.target.value || null)}
      >
        {isLoading && <option disabled>Loading...</option>}
        {isError && <option disabled>Error loading telescopes</option>}
        {data?.map((telescope) => (
          <option key={telescope.name} value={telescope.name}>
            {telescope.displayName}
          </option>
        ))}
      </select>
    </div>
  );
};
