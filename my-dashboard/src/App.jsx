
import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Store from "./pages/Reports";
import ProductsPage from "./pages/ProductsPage";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import TrackOrder from "./pages/TrackOrder";
import ProductDetails from "./pages/ProductDetails";

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app-shell">
      {!hideLayout && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {!hideLayout && (
          <Header onOpenSidebar={() => setSidebarOpen(true)} />
        )}

        <main className="main">
          <div className="container">
            <Routes>

              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/store" element={<ProtectedRoute><Store /></ProtectedRoute>} />
              <Route path="/category/:slug" element={<ProtectedRoute><Store /></ProtectedRoute>} />

              <Route
                path="/manage"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/orders" element={<ProtectedRoute requiredRole="user"><Orders /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute requiredRole="user"><Wishlist /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute requiredRole="user"><Cart /></ProtectedRoute>} />
              <Route path="/track-order" element={<ProtectedRoute requiredRole="user"><TrackOrder /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />

              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

              <Route path="*" element={<div style={{ padding: 40 }}>Page not found</div>} />
            </Routes>
          </div>
        </main>

        {!hideLayout && <Footer />}
      </div>
    </div>
  );
}