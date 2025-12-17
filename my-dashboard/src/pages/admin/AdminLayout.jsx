import { Outlet } from "react-router-dom";
import "../pages/admin/AdminProducts.css"; // import admin styles ONCE

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h3>Admin</h3>

        <nav>
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/products">Products</a>
          <a href="/admin/orders">Orders</a>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
