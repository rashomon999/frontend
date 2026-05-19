import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/compunet2-2026",
});

api.interceptors.request.use((config) => {
  const persistedState = localStorage.getItem("persist:root");

  if (persistedState) {
    const parsedState = JSON.parse(persistedState);

    const auth = JSON.parse(parsedState.auth);

    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("persist:root");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;