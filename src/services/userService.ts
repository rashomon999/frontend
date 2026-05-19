import api from "../api/axios";

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  institutionalEmail: string;
  role: string;
}

export interface UserRequest {
  firstName: string;
  lastName: string;
  institutionalEmail: string;
  password: string;
  roleId: number;
}

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await api.get<UserResponse[]>("/rest/users");
  return response.data;
};

export const getUserById = async (id: number): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`/rest/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, data: UserRequest): Promise<UserResponse> => {
  const response = await api.put<UserResponse>(`/rest/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/rest/users/${id}`);
};