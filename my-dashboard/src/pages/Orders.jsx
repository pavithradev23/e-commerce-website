import React from "react";
import { useShop } from "../context/ShopContext";

export default function Orders() {
  const { orders } = useShop();

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
            }}
          >
            <h3>Order #{order.id}</h3>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> {order.status}</p>

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

