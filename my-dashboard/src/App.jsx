import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Store from "./pages/Reports";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import TrackOrder from "./pages/TrackOrder";
import ProductDetails from "./pages/ProductDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/Adminorders";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized"; 
import Chatbot from "./components/Chatbot"; 

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:category" element={<Store />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
      
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>


      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="*"
        element={<div style={{ padding: 40 }}>Page not found</div>}
      />
    </Routes>
  );
}