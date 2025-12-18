import React from "react";
import { useShop } from "../context/ShopContext";

export default function Orders() {
  const { orders, removeOrder } = useShop();

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ marginBottom: 20 }}>Your Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet. Start shopping!</p>
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
              }}
            >
              Remove
            </button>

            <h3>Order #{order.id}</h3>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "#4caf50", fontWeight: 600 }}>
                {order.status}
              </span>
            </p>

            <h4 style={{ marginTop: 10 }}>Items:</h4>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.title} × {item.qty} — ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
