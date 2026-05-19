import api from "../api/axios";

export interface RecommendationResponse {
  id: number;
  description: string;
  dateCreated: string;
  userId: number;
  userEmail: string;
  trainerId: number;
  trainerEmail: string;
}

export interface RecommendationRequest {
  description: string;
  userId: number;
  trainerId: number;
}

export const getRecommendations = async (): Promise<RecommendationResponse[]> => {
  const response = await api.get<RecommendationResponse[]>("/rest/recommendations");
  return response.data;
};

export const getRecommendationById = async (id: number): Promise<RecommendationResponse> => {
  const response = await api.get<RecommendationResponse>(`/rest/recommendations/${id}`);
  return response.data;
};

export const createRecommendation = async (data: RecommendationRequest): Promise<RecommendationResponse> => {
  const response = await api.post<RecommendationResponse>("/rest/recommendations", data);
  return response.data;
};

export const updateRecommendation = async (id: number, data: RecommendationRequest): Promise<RecommendationResponse> => {
  const response = await api.put<RecommendationResponse>(`/rest/recommendations/${id}`, data);
  return response.data;
};

export const deleteRecommendation = async (id: number): Promise<void> => {
  await api.delete(`/rest/recommendations/${id}`);
};