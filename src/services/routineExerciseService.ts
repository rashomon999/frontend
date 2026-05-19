import api from "../api/axios";

export interface RoutineExerciseResponse {
  routineId: number;
  routineName: string;
  exerciseId: number;
  exerciseName: string;
  sets: number;
  targetReps: number;
  exerciseOrder: number;
}

export interface RoutineExerciseRequest {
  routineId: number;
  exerciseId: number;
  sets: number;
  targetReps: number;
  exerciseOrder: number;
}

export const getRoutineExercises = async (): Promise<RoutineExerciseResponse[]> => {
  const response = await api.get<RoutineExerciseResponse[]>("/rest/routine-exercises");
  return response.data;
};

export const createRoutineExercise = async (data: RoutineExerciseRequest): Promise<RoutineExerciseResponse> => {
  const response = await api.post<RoutineExerciseResponse>("/rest/routine-exercises", data);
  return response.data;
};

export const deleteRoutineExercise = async (routineId: number, exerciseId: number): Promise<void> => {
  await api.delete(`/rest/routine-exercises/${routineId}/${exerciseId}`);
};