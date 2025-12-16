import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

/* Layouts */
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

/* User Pages */
import Home from "./pages/Home";
import Store from "./pages/Reports";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import TrackOrder from "./pages/TrackOrder";
import ProductDetails from "./pages/ProductDetails";

/* Admin Pages */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

/* Auth Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>

      {/* ---------- USER AREA ---------- */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Route>

      {/* ---------- ADMIN AREA ---------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* ---------- AUTH ---------- */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<div style={{ padding: 40 }}>Page not found</div>} />
    </Routes>
  );
}
