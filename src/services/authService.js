import api from "../api/axios";

export const login = async (institutionalEmail, password) => {
  const response = await api.post(
    "/rest/public/auth/login",
    {
      institutionalEmail,
      password,
    }
  );

  return response.data;
};