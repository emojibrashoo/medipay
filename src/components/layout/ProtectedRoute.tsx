import { useAuthStore, UserRole } from "@/store/authStore";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'doctor' ? '/doctor' : 
                        user.role === 'institution' ? '/institution' :
                        user.role === 'insurance' ? '/insurance' : '/patient';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}