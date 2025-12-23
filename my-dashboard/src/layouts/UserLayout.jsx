import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Chatbot from '../components/Chatbot'; 

export default function UserLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main className="main">
          <div className="container">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <Chatbot />
    </div>
  );
}
