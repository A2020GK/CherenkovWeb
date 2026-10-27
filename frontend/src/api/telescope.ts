import type { Telescope, TelescopeLayout } from "../types/telescope";
import { apiClient } from "./client";

export const getTelescopes = async (): Promise<Telescope[]> => {
  console.log("Fetching telescopes...");
  const response = await apiClient.get<Telescope[]>("/telescope/list");
  return response.data;
};

export const getTelescopeLayout = async (
  telescopeName: string,
): Promise<TelescopeLayout> => {
  console.log(`Fetching layout for telescope: ${telescopeName}`);
  const response = await apiClient.get<TelescopeLayout>(
    `/telescope/${telescopeName}`,
  );
  return response.data;
};
