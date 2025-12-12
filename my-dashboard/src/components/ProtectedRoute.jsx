import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch — allow admin everywhere
  if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
