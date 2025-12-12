import React from "react";

export default function Undo({ items = [], onUndo }) {
  if (!items || items.length === 0) return null;
  const last = items[items.length - 1];
  return (
    <div style={{
      position: "fixed",
      right: 20,
      bottom: 20,
      zIndex: 9999,
      background: "rgba(20,20,20,0.9)",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: 10,
      boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
      display: "flex",
      gap: 12,
      alignItems: "center",
      minWidth: 260
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{last.item.title}</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>Deleted — undo within a few seconds</div>
      </div>
      <div>
        <button className="btn small ghost" onClick={() => onUndo(last.id)} style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>Undo</button>
      </div>
    </div>
  );
}

