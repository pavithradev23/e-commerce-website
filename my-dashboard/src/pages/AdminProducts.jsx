import React from "react";
import "../admin/AdminProducts.css";
export default function AdminProducts() {
  return (
    <div className="admin-card">
      <h3>Products List</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>T-Shirt</td>
            <td>Men</td>
            <td>$79.80</td>
            <td>79</td>
            <td><span className="badge active">Active</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
