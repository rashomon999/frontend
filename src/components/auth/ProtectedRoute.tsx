import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Role } from "../../store/slices/authSlice";
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Si hay roles permitidos y el usuario no tiene el rol necesario
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;