import api from "../api/axios";

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export const login = async (institutionalEmail: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/rest/public/auth/login",
    {
      institutionalEmail,
      password,
    }
  );

  return response.data;
};