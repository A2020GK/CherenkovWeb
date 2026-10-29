import { apiClient } from "./client";
import type { Event } from "./types";

export const getEventList = async (telescopeName: string): Promise<Event[]> => {
  console.log("Fetching telescopes...");
  const response = await apiClient.get<Event[]>(`/telescope/${telescopeName}/events`);
  return response.data;
};