import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./AdminProduct.css";

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
