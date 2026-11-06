import { useQuery } from "@tanstack/react-query";
import { getEventList } from "../api/event";

export const EventList = ({
  telescope,
  eventName,
  setEventName,
}: {
  telescope: string | null;
  eventName: string | null;
  setEventName: (name: string | null) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["eventList"],
    queryFn: async () => await getEventList(telescope!),
  });

  return (
    <div className="event-list">
      <h1>События</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading && data?.length === 0 && <div>Нет событий</div>}
      {!isLoading && data && data.length > 0 && (
        <ul>
          {data.map((event) => (
            <li
              key={event.name}
              className={event.name === eventName ? "selected" : undefined}
            >
              <button onClick={() => setEventName(event.name)}>
                {event.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
