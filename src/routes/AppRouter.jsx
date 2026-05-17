import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsersPage from "../pages/users/UsersPage";

import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />


        <Route
        path="/users"
        element={
            <ProtectedRoute>
            <UsersPage />
            </ProtectedRoute>
        }
        />

      </Routes>
    </BrowserRouter>
  );
}