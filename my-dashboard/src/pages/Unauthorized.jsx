import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center"
    }}>
      <div>
        <h1 style={{ fontSize: 48, color: "#ef4444" }}>403</h1>
        <h2>Access Denied</h2>
        <p style={{ margin: "20px 0", color: "#6b7280" }}>
          You don't have permission to access this page.
        </p>
        <Link 
          to="/"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#6366f1",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px"
          }}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}