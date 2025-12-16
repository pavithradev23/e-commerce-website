import "./AdminProduct.css";

export default function AdminProducts() {
  return (
    <div className="admin-main">
      <div className="admin-content">
        <h2>Products</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {/* map products here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
