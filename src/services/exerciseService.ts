import api from "../api/axios";

export interface ExerciseResponse {
  id: number;
  name: string;
  type: string;
  description: string;
  durationMin: number;
  difficulty: string;
  videoUrl: string;
  userId: number;
}

export interface ExerciseRequest {
  name: string;
  type: string;
  description: string;
  durationMin: number;
  difficulty: string;
  videoUrl: string;
  userId: number;
}

export const getExercises = async (): Promise<ExerciseResponse[]> => {
  const response = await api.get<ExerciseResponse[]>("/rest/exercises");
  return response.data;
};

export const createExercise = async (data: ExerciseRequest): Promise<ExerciseResponse> => {
  const response = await api.post<ExerciseResponse>("/rest/exercises", data);
  return response.data;
};

export const updateExercise = async (id: number, data: ExerciseRequest): Promise<ExerciseResponse> => {
  const response = await api.put<ExerciseResponse>(`/rest/exercises/${id}`, data);
  return response.data;
};

export const deleteExercise = async (id: number): Promise<void> => {
  await api.delete(`/rest/exercises/${id}`);
};