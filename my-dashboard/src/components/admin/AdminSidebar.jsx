import React from "react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 16px",
  textDecoration: "none",
  color: isActive ? "#4f46e5" : "#374151",
  background: isActive ? "#eef2ff" : "transparent",
  borderRadius: 6,
});

export default function AdminSidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: "#fff",
        padding: 16,
        borderRight: "1px solid #e5e7eb",
      }}
    >
      <h4 style={{ marginBottom: 20 }}>Admin</h4>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <NavLink to="/admin/dashboard" style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/products" style={linkStyle}>
          Products
        </NavLink>
        <NavLink to="/admin/orders" style={linkStyle}>
          Orders
        </NavLink>
      </nav>
    </aside>
  );
}
