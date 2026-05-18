import api from "../api/axios";

export interface RecommendationResponse {
  id: number;
  description: string;
  userId: number;
  trainerId: number;
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

export const createRecommendation = async (data: RecommendationRequest): Promise<RecommendationResponse> => {
  const response = await api.post<RecommendationResponse>("/rest/recommendations", data);
  return response.data;
};