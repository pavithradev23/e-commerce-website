import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useShop } from "../context/ShopContext";


export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, wishlist, cart } = useShop();
  const navigate = useNavigate();

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleGlobalSearch = (value) => {
    setSearchTerm(value);
    if (value.trim().length > 0) {
      navigate("/store");
    }
  };
  return (
    <>
      <header className="header">
        <div className="header-inner container">

          {/* LEFT SIDE */}
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={onToggleSidebar}
            >
              ☰
            </button>

            <div className="logo">
              <span className="mark">YS</span> YoziShop
            </div>
          </div>


          {/* CENTER NAVIGATION */}
          <div className="header-center">
            <nav className="header-cats">

              {/* HOME – visible to all logged users */}
              <NavLink to="/" className="header-cat">
                Home
              </NavLink>

              {/* STORE – visible to all logged users */}
              <NavLink to="/store" className="header-cat">
                Store
              </NavLink>

              {/* MANAGE – only admin */}
              {user?.role === "admin" && (
                <NavLink to="/manage" className="header-cat">
                  Manage
                </NavLink>
              )}

              {/* ORDERS – only normal user */}
              {user?.role === "user" && (
                <NavLink to="/orders" className="header-cat">
                  Orders
                </NavLink>
              )}
            </nav>

            {/* SEARCH BOX */}
            <div className="search-small">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                style={{
                  width: "230px",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="header-right">
            <button
              className="icon-btn"
              onClick={() => navigate("/track-order")}
            >
              Track Order
            </button>

            <button className="icon-btn" onClick={() => navigate("/wishlist")}>
              ♡ <span className="badge">{wishlist.length}</span>
            </button>

            <div
              className="icon-btn"
              onClick={() => navigate("/cart")}
              style={{ cursor: "pointer" }}
            >
              🛒 <span className="badge">{cart.length}</span>
            </div>

            {/* AUTH BUTTONS */}
            {user ? (
              <>
                <button
                  className="icon-btn"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="icon-btn">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="icon-btn"
                  style={{ background: "var(--brand)", color: "#fff" }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

     
    </>
  );
}