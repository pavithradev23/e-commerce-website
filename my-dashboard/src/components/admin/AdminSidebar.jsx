import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthProvider"; 

export default function AdminSidebar() {
  const { user } = useAuth();
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/orders", label: "Orders", icon: "📋" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
        {user && (
          <div className="user-badge">
            <span>{user.name}</span>
            <small>{user.role}</small>
          </div>
        )}
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}