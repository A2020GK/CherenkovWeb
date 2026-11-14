import type { Telescope, TelescopeLayout } from "./types";
import { apiClient } from "./client";

export const getTelescopes = async (): Promise<Telescope[]> => {
  console.log("Fetching telescopes...");
  const response = await apiClient.get<Telescope[]>("/");
  return response.data;
};

export const getTelescopeLayout = async (
  telescopeName: string,
): Promise<TelescopeLayout> => {
  console.log(`Fetching layout for telescope: ${telescopeName}`);
  const response = await apiClient.get<TelescopeLayout>(`/${telescopeName}`);
  return response.data;
};
