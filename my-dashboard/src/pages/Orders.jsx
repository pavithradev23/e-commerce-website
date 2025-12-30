import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider"; // Fix path if needed
import { useShop } from "../context/ShopContext";

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { orders, removeOrder } = useShop();

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/orders");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <p>Checking authentication...</p>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <div style={{ marginBottom: 25 }}>
        <h1 style={{ marginBottom: 10 }}>Your Orders</h1>
        <p style={{ color: "#666" }}>
          Welcome back, <strong>{user?.name}</strong>! Here are your recent orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "50px 20px",
          background: "#f8f9fa",
          borderRadius: 12 
        }}>
          <p style={{ fontSize: 18, marginBottom: 10 }}>No orders yet.</p>
          <p style={{ color: "#666", marginBottom: 20 }}>Start shopping to see your orders here!</p>
          <button
            onClick={() => navigate("/store")}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
              position: "relative",
              borderLeft: `4px solid ${
                order.status === "delivered" ? "#4caf50" :
                order.status === "shipped" ? "#2196f3" :
                order.status === "pending" ? "#ff9800" : "#9e9e9e"
              }`
            }}
          >
            <button
              onClick={() => removeOrder(order.id)}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                padding: "6px 14px",
                borderRadius: 14,
                cursor: "pointer",
                fontSize: 12
              }}
            >
              Remove
            </button>

            <div style={{ marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
              <div style={{ 
                display: "flex", 
                gap: 20, 
                marginTop: 5,
                fontSize: 14,
                color: "#666"
              }}>
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Total:</strong> ${order.total?.toFixed(2) || "0.00"}</p>
              </div>
            </div>

            <div style={{ 
              display: "inline-block",
              background: order.status === "delivered" ? "#e8f5e9" :
                         order.status === "shipped" ? "#e3f2fd" :
                         order.status === "pending" ? "#fff3e0" : "#f5f5f5",
              color: order.status === "delivered" ? "#2e7d32" :
                    order.status === "shipped" ? "#1565c0" :
                    order.status === "pending" ? "#ef6c00" : "#616161",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 15
            }}>
              {order.status || "Processing"}
            </div>

            <h4 style={{ marginTop: 15, marginBottom: 10 }}>Items:</h4>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {order.items?.map((item) => (
                <li key={item.id} style={{ marginBottom: 5 }}>
                  {item.title || item.name} × {item.qty || item.quantity} — ${item.price || 0}
                </li>
              )) || <li>No items found</li>}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}