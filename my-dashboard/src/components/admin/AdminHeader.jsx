import React from "react";
import { useAuth } from "../AuthProvider";

export default function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        height: 64,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h3 style={{ margin: 0 }}>Admin Dashboard</h3>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span>{user?.email}</span>
        <button onClick={logout} style={{ cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </header>
  );
}
