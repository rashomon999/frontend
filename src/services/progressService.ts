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

export const createProgress = async (data: ProgressRequest): Promise<ProgressResponse> => {
  const response = await api.post<ProgressResponse>("/rest/progress", data);
  return response.data;
};