import { apiClient } from "./client";
import type { Event, EventData } from "./types";

export const getEventList = async (telescopeName: string): Promise<Event[]> => {
  console.log(`Fetching events for telescope: ${telescopeName}`);
  const response = await apiClient.get<Event[]>(
    `/telescope/${telescopeName}/events`,
  );
  return response.data;
};

export const getEventData = async (
  telescopeName: string,
  eventName: string,
): Promise<EventData> => {
  console.log(`Fetching event data ${telescopeName}/${eventName}`);
  const response = await apiClient.get<EventData>(
    `/telescope/${telescopeName}/${eventName}`,
  );
  return response.data;
};
