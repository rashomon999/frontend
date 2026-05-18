import api from "../api/axios";

export interface SpaceResponse {
  id: number;
  name: string;
  capacity: number;
  location: string;
}

export interface SpaceRequest {
  name: string;
  capacity: number;
  location: string;
}

export const getSpaces = async (): Promise<SpaceResponse[]> => {
  const response = await api.get<SpaceResponse[]>("/rest/spaces");
  return response.data;
};

export const createSpace = async (data: SpaceRequest): Promise<SpaceResponse> => {
  const response = await api.post<SpaceResponse>("/rest/spaces", data);
  return response.data;
};