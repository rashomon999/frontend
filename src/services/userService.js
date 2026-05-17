import api from "../api/axios";

export const getUsers = async () => {
  const response = await api.get("/rest/users");

  return response.data;
};