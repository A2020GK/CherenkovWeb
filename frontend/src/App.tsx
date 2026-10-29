import { useLocalStorage } from "./hooks/useLocalStorage";
import { Header } from "./components/Header";
import { useQuery } from "@tanstack/react-query";
import { getTelescopes } from "./api/telescope";
import { TelescopeLayout } from "./components/TelescopeLayout";
import { useEffect } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { EventList } from "./components/EventList";

export const App = () => {
  const { data } = useQuery({
    queryKey: ["telescopes"],
    queryFn: getTelescopes,
    staleTime: "static",
  });

  const [telescope, setTelescope] = useLocalStorage<string | null>(
    "telescope",
    null,
  );

  useEffect(() => {
    if (!data?.length) return;

    const currentIsValid =
      telescope !== null && data.some((item) => item.name === telescope);

    if (!currentIsValid) {
      console.log("Auto-selecting", data[0].name);
      setTelescope(data[0].name);
    }
  }, [telescope, data, setTelescope]);

  return (
    <>
      <Header telescope={telescope} setTelescope={setTelescope} />
      <main>
        <Group className="panel-group">
          <Panel className="panel" collapsible defaultSize="25%" minSize={100} maxSize="50%">
            <EventList telescope={telescope} />
          </Panel>

          <Separator className="panel-separator"/>

          <Panel className="panel">
            <TelescopeLayout telescope={telescope} key={telescope} />
          </Panel>
        </Group >
      </main >
    </>
  );
};
