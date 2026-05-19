import api from "../api/axios";

export interface ProgressResponse {
  id: number;
  dateLogged: string;
  reps: number;
  durationMin: number;
  effortLevel: number;
  setNumber: number;
  weightKg: number;
  exerciseId: number;
  exerciseName: string;
  routineId: number;
  routineName: string;
  userId: number;
  userEmail: string;
}

export interface ProgressRequest {
  reps: number;
  durationMin: number;
  effortLevel: number;
  setNumber: number;
  weightKg: number;
  exerciseId: number;
  routineId: number;
  userId: number;
}

export const getProgress = async (): Promise<ProgressResponse[]> => {
  const response = await api.get<ProgressResponse[]>("/rest/progress");
  return response.data;
};

export const getProgressById = async (id: number): Promise<ProgressResponse> => {
  const response = await api.get<ProgressResponse>(`/rest/progress/${id}`);
  return response.data;
};

export const createProgress = async (data: ProgressRequest): Promise<ProgressResponse> => {
  const response = await api.post<ProgressResponse>("/rest/progress", data);
  return response.data;
};

export const updateProgress = async (id: number, data: ProgressRequest): Promise<ProgressResponse> => {
  const response = await api.put<ProgressResponse>(`/rest/progress/${id}`, data);
  return response.data;
};

export const deleteProgress = async (id: number): Promise<void> => {
  await api.delete(`/rest/progress/${id}`);
};