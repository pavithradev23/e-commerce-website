import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useShop } from "../context/ShopContext";
import Sidebar from "./Sidebar";

const headerCategories = [
  { to: "/", label: "Home" },
  { to: "/reports", label: "Store" },
  { to: "/products", label: "Manage" },
  { to: "/settings", label: "Orders" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, wishlist, cart } = useShop();
  const navigate = useNavigate();

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleGlobalSearch = (value) => {
    setSearchTerm(value);
    if (value.trim().length > 0) {
      navigate("/reports");
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-inner container">
          <div className="header-left">
            <button
              className="hamburger-btn"
              onClick={() => setOpenSidebar(true)}
              style={{ display: "block" }}
            >
              ☰
            </button>

            <div className="logo">
              <span className="mark">YS</span> YoziShop
            </div>
          </div>

          <div className="header-center">
            <nav className="header-cats">
              {headerCategories.map((c) => (
                <NavLink
                  key={c.to}
                  to={c.to}
                  className={({ isActive }) =>
                    "header-cat" + (isActive ? " active" : "")
                  }
                >
                  {c.label}
                </NavLink>
              ))}
            </nav>

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

      <Sidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />
    </>
  );
}

