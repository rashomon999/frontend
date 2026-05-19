import api from "../api/axios";

export interface CoachingResponse {
  trainerId: number;
  trainerEmail: string;
  userId: number;
  userEmail: string;
}

export interface CoachingRequest {
  trainerId: number;
  userId: number;
}

export const getCoachingAssignments = async (): Promise<CoachingResponse[]> => {
  const response = await api.get<CoachingResponse[]>("/rest/coaching");
  return response.data;
};

export const createCoachingAssignment = async (data: CoachingRequest): Promise<CoachingResponse> => {
  const response = await api.post<CoachingResponse>("/rest/coaching", data);
  return response.data;
};

export const deleteCoachingAssignment = async (trainerId: number, userId: number): Promise<void> => {
  await api.delete(`/rest/coaching/${trainerId}/${userId}`);
};