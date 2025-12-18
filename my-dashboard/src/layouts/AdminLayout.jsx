import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import "../pages/admin/AdminProducts.css"; 

export default function AdminLayout() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    const currentPath = window.location.pathname;
    localStorage.setItem("redirectAfterLogin", currentPath);
    return <Navigate to="/unauthorized" replace />;
  }
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}