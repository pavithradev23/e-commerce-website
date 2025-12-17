import React from "react";
import { FiSearch, FiBell } from "react-icons/fi";

export default function AdminHeader() {
  return (
    <div className="admin-header">
      {/* Left */}
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Center */}
      <div className="admin-search">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search stock, order, etc"
        />
      </div>

      {/* Right */}
      <div className="admin-actions">
        <FiBell className="icon" />

        <div className="admin-profile">
          <img
            src="https://i.pravatar.cc/40"
            alt="admin"
          />
          <div>
            <p className="name">Marcus George</p>
            <span className="role">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
