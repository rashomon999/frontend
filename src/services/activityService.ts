import api from "../api/axios";

export interface ActivityResponse {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  spaceId: number;
  spaceName: string;
}

export interface ActivityRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  spaceId: number;
}

export const getActivities = async (): Promise<ActivityResponse[]> => {
  const response = await api.get<ActivityResponse[]>("/rest/activities");
  return response.data;
};

export const getActivityById = async (id: number): Promise<ActivityResponse> => {
  const response = await api.get<ActivityResponse>(`/rest/activities/${id}`);
  return response.data;
};

export const createActivity = async (data: ActivityRequest): Promise<ActivityResponse> => {
  const response = await api.post<ActivityResponse>("/rest/activities", data);
  return response.data;
};

export const updateActivity = async (id: number, data: ActivityRequest): Promise<ActivityResponse> => {
  const response = await api.put<ActivityResponse>(`/rest/activities/${id}`, data);
  return response.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  await api.delete(`/rest/activities/${id}`);
};