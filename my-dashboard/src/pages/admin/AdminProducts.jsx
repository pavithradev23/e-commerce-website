import React, { useEffect, useState } from "react";
import "../admin/AdminProducts.css";

const PRODUCTS_PER_PAGE = 6;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  const [undoData, setUndoData] = useState(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((p) => ({
          ...p,
          stock: Math.floor(Math.random() * 50) + 10,
          status: "Active",
        }));
        setProducts(enriched);
        setFilteredProducts(enriched);
        setLoading(false);
      });
  }, []);

  /* ---------------- SEARCH + FILTER ---------------- */
  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [search, categoryFilter, products]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  /* ---------------- FORM HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setShowForm(true);
    setFormData({
      id: null,
      title: "",
      category: "",
      price: "",
      stock: "",
      image: "",
    });
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setShowForm(true);
    setFormData(product);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === formData.id ? formData : p))
      );
    } else {
      setProducts((prev) => [
        { ...formData, id: Date.now(), status: "Active" },
        ...prev,
      ]);
    }

    setShowForm(false);
  };

  /* ---------------- DELETE + UNDO ---------------- */
  const handleDelete = (product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setUndoData(product);

    setTimeout(() => setUndoData(null), 5000);
  };

  const handleUndo = () => {
    setProducts((prev) => [undoData, ...prev]);
    setUndoData(null);
  };

  /* ---------------- SEE ALL ---------------- */
  const handleSeeAll = () => {
    setSearch("");
    setCategoryFilter("all");
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <div className="admin-products-page">
      {/* HEADER */}
      <div className="products-header">
        <h2>Products</h2>
        <div className="actions">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="btn"
          >
            <option value="all">All Categories</option>
            <option value="men's clothing">Men</option>
            <option value="women's clothing">Women</option>
            <option value="electronics">Electronics</option>
          </select>

          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <button className="btn" onClick={handleSeeAll}>
            See All
          </button>

          <button className="btn primary" onClick={handleAddClick}>
            + Add Product
          </button>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>

          <input name="title" placeholder="Product Name" value={formData.title} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />

          <div className="form-actions">
            <button className="btn primary" type="submit">
              {isEditing ? "Update" : "Add"}
            </button>
            <button className="btn" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* UNDO MESSAGE */}
      {undoData && (
        <div className="undo-toast">
          <strong>{undoData.title}</strong> deleted.
          <button onClick={handleUndo}>Undo</button>
        </div>
      )}

      {/* TABLE */}
      <table className="products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p) => (
            <tr key={p.id}>
              <td className="product-cell">
                <img src={p.image} alt={p.title} />
                {p.title}
              </td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td>{p.stock}</td>
              <td><span className="status active">Active</span></td>
              <td>
                <button className="btn small" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn small danger" onClick={() => handleDelete(p)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
