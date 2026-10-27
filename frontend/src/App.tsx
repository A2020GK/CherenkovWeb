import { useLocalStorage } from "./hooks/useLocalStorage";
import { Header } from "./components/Header";
import { useQuery } from "@tanstack/react-query";
import { getTelescopes } from "./api/telescope";
import { TelescopeLayout } from "./components/TelescopeLayout";

export const App = () => {
  const { data } = useQuery({
    queryKey: ["telescopes"],
    queryFn: getTelescopes,
  });

  const [telescope, setTelescope] = useLocalStorage<string | null>(
    "telescope",
    null,
  );

  return (
    <>
      <Header telescope={telescope} setTelescope={setTelescope} />
      <main>
        <TelescopeLayout telescope={telescope} />
      </main>
    </>
  );
};
