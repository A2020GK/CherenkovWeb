import { useQuery } from "@tanstack/react-query";
import { getEventList } from "../api/event";

export const EventList = ({telescope}: {telescope: string|null}) => {
    
    const { data, isLoading } = useQuery({
        queryKey: ["eventList"],
        queryFn: () => getEventList(telescope!),
    });


    return <div className="event-list">
        <h1>События</h1>
        {isLoading && <div>Загрузка...</div>}
        {!isLoading && data?.length === 0 && <div>Нет событий</div>}
        {!isLoading && data && data.length > 0 && <ul>
            {data.map(event => <li key={event.name}>{event.name}</li>)}
        </ul>}
    </div>
}