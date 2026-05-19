import api from "../api/axios";

export interface EnrollmentResponse {
  id: number;
  userId: number;
  userEmail: string;
  activityId: number;
  activityName: string;
}

export interface EnrollmentRequest {
  userId: number;
  activityId: number;
}

export const getEnrollments = async (): Promise<EnrollmentResponse[]> => {
  const response = await api.get<EnrollmentResponse[]>("/rest/enrollments");
  return response.data;
};

export const getEnrollmentById = async (id: number): Promise<EnrollmentResponse> => {
  const response = await api.get<EnrollmentResponse>(`/rest/enrollments/${id}`);
  return response.data;
};

export const createEnrollment = async (data: EnrollmentRequest): Promise<EnrollmentResponse> => {
  const response = await api.post<EnrollmentResponse>("/rest/enrollments", data);
  return response.data;
};

export const deleteEnrollment = async (id: number): Promise<void> => {
  await api.delete(`/rest/enrollments/${id}`);
};