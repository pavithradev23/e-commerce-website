import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    localStorage.setItem("redirectAfterLogin", location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    if (requiredRole === "admin") {
      if (!isAdmin) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
    else if (user?.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}