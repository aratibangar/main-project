import type React from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check if user is authenticated
  
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
