import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UsersPage from "../pages/users/UsersPage";
import RoutinesPage from "../pages/routines/RoutinesPage";
import ExercisesPage from "../pages/exercises/ExercisesPage";
import ProgressPage from "../pages/progress/ProgressPage";
import SpacesPage from "../pages/spaces/SpacesPage";
import CoachingPage from "../pages/coaching/CoachingPage";
import ActivitiesPage from "../pages/activities/ActivitiesPage";
import RecommendationsPage from "../pages/recommendations/RecommendationsPage";

import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}><UsersPage /></ProtectedRoute>
        } />

        <Route path="/routines" element={
          <ProtectedRoute allowedRoles={["ADMIN", "TRAINER", "USER"]}><RoutinesPage /></ProtectedRoute>
        } />

        <Route path="/exercises" element={
          <ProtectedRoute><ExercisesPage /></ProtectedRoute>
        } />

        <Route path="/progress" element={
          <ProtectedRoute allowedRoles={["USER"]}><ProgressPage /></ProtectedRoute>
        } />

        <Route path="/spaces" element={
          <ProtectedRoute><SpacesPage /></ProtectedRoute>
        } />

        <Route path="/coaching" element={
          <ProtectedRoute allowedRoles={["TRAINER", "ADMIN"]}><CoachingPage /></ProtectedRoute>
        } />

        <Route path="/activities" element={
          <ProtectedRoute><ActivitiesPage /></ProtectedRoute>
        } />

        <Route path="/recommendations" element={
          <ProtectedRoute allowedRoles={["ADMIN", "TRAINER", "USER"]}><RecommendationsPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}