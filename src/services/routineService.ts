import api from "../api/axios";

export interface RoutineResponse {
  id: number;
  name: string;
  description: string;
  userId: number;
  isPredefined: boolean;
}

export interface RoutineRequest {
  name: string;
  description: string;
  userId: number;
  isPredefined?: boolean;
}

export const getRoutines = async (): Promise<RoutineResponse[]> => {
  const response = await api.get<RoutineResponse[]>("/rest/routines");
  return response.data;
};

export const createRoutine = async (data: RoutineRequest): Promise<RoutineResponse> => {
  const response = await api.post<RoutineResponse>("/rest/routines", data);
  return response.data;
};

export const updateRoutine = async (id: number, data: RoutineRequest): Promise<RoutineResponse> => {
  const response = await api.put<RoutineResponse>(`/rest/routines/${id}`, data);
  return response.data;
};

export const deleteRoutine = async (id: number): Promise<void> => {
  await api.delete(`/rest/routines/${id}`);
};