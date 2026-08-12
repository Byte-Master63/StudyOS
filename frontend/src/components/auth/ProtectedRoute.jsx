import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { token, initializing } = useAuth();

  if (initializing) {
    return <div className="min-h-screen flex items-center justify-center bg-paper"><p className="font-mono text-ink">Loading StudyOS...</p></div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
