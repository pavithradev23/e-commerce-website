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
  <h1 className="track-title">Track Your Order</h1>

  {/* Search Section */}
  <div className="track-search">
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

  {/* No Order Found */}
  {searched && !order && (
    <p className="track-error">
      No order found for ID <strong>{orderId}</strong>
    </p>
  )}

  {/* Order Details */}
  {order && (
    <div className="order-card">
      <h3>Order Details</h3>

      <div className="order-row">
        <span>ID:</span>
        <span>{order.id}</span>
      </div>

      <div className="order-row">
        <span>Total:</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <div className="order-row">
        <span>Date:</span>
        <span>{order.date}</span>
      </div>

      <div className="order-row">
        <span>Status:</span>
        <span className="order-status">{order.status}</span>
      </div>
    </div>
  )}
</div>

  );
}
