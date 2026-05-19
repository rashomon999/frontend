import { configureStore } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import authReducer from "./slices/authSlice";

interface User {
  id: number;
  email: string;
  role: string;
  authorities: string[];
}

const tokenFromStorage = localStorage.getItem("token");
let preloadedState = {};

if (tokenFromStorage) {
  try {
    const user = jwtDecode<User>(tokenFromStorage);
    preloadedState = {
      auth: { token: tokenFromStorage, user, isAuthenticated: true },
    };
  } catch {
      preloadedState = {
        auth: { token: null, user: null, isAuthenticated: false },
      };
  }
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;