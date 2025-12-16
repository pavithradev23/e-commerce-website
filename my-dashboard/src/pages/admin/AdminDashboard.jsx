import React from "react";

export default function AdminDashboard() {
  return (
    <div>
      <h2>Overview</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        <div className="card">Total Products</div>
        <div className="card">Total Orders</div>
        <div className="card">Total Users</div>
      </div>
    </div>
  );
}
