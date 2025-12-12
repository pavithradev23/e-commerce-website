import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  const categories = [
    { name: "electronics", label: "Electronics" },
    { name: "jewelery", label: "Jewellery" },
    { name: "men", label: "Men Clothing" },
    { name: "women", label: "Women Clothing" }
  ];

  return (
    <>
     
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Categories</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="sidebar-list">
          {categories.map((cat) => (
            <NavLink
              key={cat.name}
              to={`/category/${cat.name}`}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              {cat.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
