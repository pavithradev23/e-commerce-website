import React from "react";
import { FiSearch, FiBell, FiLogOut } from "react-icons/fi";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-header">  
      <h2 className="admin-title">Admin Dashboard</h2>

      <div className="admin-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search stock, order, etc"
        />
      </div>

      <div className="admin-actions">
        <FiBell className="icon" />

        <div className="admin-profile">
          <img
            src="https://i.pravatar.cc/40"
            alt="admin"
          />
          <div>
            <p className="name">{user?.name || "Admin User"}</p>
            <span className="role">{user?.role || "Admin"}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="logout-btn"
          title="Logout"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FiLogOut size={20} />
        </button>
      </div>
    </div>
  );
}