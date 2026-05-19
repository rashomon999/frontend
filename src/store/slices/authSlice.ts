import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export type Role = "ADMIN" | "TRAINER" | "USER";

interface User {
  id: number;
  email: string;
  role: Role;
  authorities: string[];
  exp?: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string }>
    ) => {
      const { token } = action.payload;

      try {
        const decoded = jwtDecode<User>(token);

        state.token = token;
        state.user = decoded;
        state.isAuthenticated = true;

      } catch {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;