import React, { useState } from "react";
import { useShop } from "../context/ShopContext";

export default function TrackOrder() {
  const { orders } = useShop();

  const [orderId, setOrderId] = useState("");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState(null);

  const handleTrack = () => {
    setSearched(true);
    const found = orders.find((o) => String(o.id) === orderId);
    setOrder(found || null);
  };

  return (
    <div className="track-container">
      <h1>Track Your Order</h1>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="track-input"
        />
        <button onClick={handleTrack} className="track-btn">
          Track
        </button>
      </div>

      {searched && !order && (
        <p style={{ marginTop: 20 }}>
          No order found for ID {orderId}
        </p>
      )}

      {order && (
        <div className="order-box">
          <h3>Order Details</h3>

          <p><strong>ID:</strong> {order.id}</p>
          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          <p><strong>Date:</strong> {order.date}</p>

        
          <p>
            <strong>Status:</strong>
            <span style={{ marginLeft: 8, color: "#ff6600", fontWeight: 600 }}>
              {order.status || "Pending"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
