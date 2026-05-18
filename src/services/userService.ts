import api from "../api/axios";

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  institutionalEmail: string;
  role: string;
}

export const getUsers = async (): Promise<UserResponse[]> => {
  const response = await api.get<UserResponse[]>("/rest/users");

  return response.data;
};