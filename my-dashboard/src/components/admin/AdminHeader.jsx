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
      <div className="header-left">
        <h2 className="admin-title">Admin Dashboard</h2>
      </div>
      
      <div className="header-center">
        <div className="admin-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search stock, order, etc"
          />
        </div>
      </div>
      
    
      <div className="header-right">
        <div className="header-icons">
          <FiBell className="icon" />
        </div>
        
        <div className="admin-profile">
          <img
            src="https://i.pravatar.cc/40"
            alt="admin"
          />
          <div className="profile-info">
            <p className="name">{user?.name || "Admin User"}</p>
            <span className="role">{user?.role || "Admin"}</span>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="logout-btn"
          title="Logout"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}