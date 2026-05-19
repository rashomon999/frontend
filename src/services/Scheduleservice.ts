import api from "../api/axios";

export interface ScheduleResponse {
  id: number;
  day: string;
  startDate: string; // ISO timestamp string
  endDate: string;
  activityId: number;
  activityName: string;
}

export interface ScheduleRequest {
  day: string;
  startDate: string; // ISO timestamp string, e.g. "2025-05-18T08:00:00.000Z"
  endDate: string;
  activityId: number;
}

export const getSchedules = async (): Promise<ScheduleResponse[]> => {
  const response = await api.get<ScheduleResponse[]>("/rest/schedules");
  return response.data;
};

export const getScheduleById = async (id: number): Promise<ScheduleResponse> => {
  const response = await api.get<ScheduleResponse>(`/rest/schedules/${id}`);
  return response.data;
};

export const createSchedule = async (data: ScheduleRequest): Promise<ScheduleResponse> => {
  const response = await api.post<ScheduleResponse>("/rest/schedules", data);
  return response.data;
};

export const updateSchedule = async (id: number, data: ScheduleRequest): Promise<ScheduleResponse> => {
  const response = await api.put<ScheduleResponse>(`/rest/schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id: number): Promise<void> => {
  await api.delete(`/rest/schedules/${id}`);
};