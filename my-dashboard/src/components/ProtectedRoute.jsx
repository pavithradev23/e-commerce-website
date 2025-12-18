import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

 
  if (!isAuthenticated) {
   
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem("redirectAfterLogin", currentPath);
    return <Navigate to="/login" replace />;
  }

  
  if (requiredRole) {
 
    if (user?.role !== requiredRole && user?.role !== "admin") {
      if (window.location.pathname.startsWith("/admin")) {
        return <Navigate to="/unauthorized" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return children;
}