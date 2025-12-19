import React, { useEffect, useState, useCallback } from "react";
import "../admin/AdminProducts.css";

const PRODUCTS_PER_PAGE = 6;

export default function AdminProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        const enriched = data.map((product) => ({
          ...product,
          stock: Math.floor(Math.random() * 50) + 10,
          status: "Active",
        }));
        setAllProducts(enriched);
        setFilteredProducts(enriched);
        setTotalPages(Math.ceil(enriched.length / PRODUCTS_PER_PAGE));
        updateCurrentPageProducts(enriched, 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchAllProducts();
  }, []);

  const updateCurrentPageProducts = useCallback((productList, page) => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = productList.slice(startIndex, endIndex);
    setProducts(currentProducts);
  }, []);

  useEffect(() => {
    let result = [...allProducts];
    if (search.trim()) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase().trim())
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter);
    }
    setFilteredProducts(result);
    setTotalPages(Math.ceil(result.length / PRODUCTS_PER_PAGE));
    setCurrentPage(1);
    updateCurrentPageProducts(result, 1);
  }, [search, categoryFilter, allProducts, updateCurrentPageProducts]);

  useEffect(() => {
    if (!isInitialLoad && filteredProducts.length > 0) {
      updateCurrentPageProducts(filteredProducts, currentPage);
    }
  }, [currentPage, filteredProducts, isInitialLoad, updateCurrentPageProducts]);

  const totalFilteredProducts = filteredProducts.length;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(currentPage * PRODUCTS_PER_PAGE, totalFilteredProducts);
  const showingStart = totalFilteredProducts > 0 ? startIndex + 1 : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
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
      const updatedAllProducts = allProducts.map((p) =>
        p.id === formData.id ? { ...formData } : p
      );
      setAllProducts(updatedAllProducts);
      setFilteredProducts((prev) =>
        prev.map((p) => (p.id === formData.id ? { ...formData } : p))
      );
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        status: "Active",
      };
      const updatedAllProducts = [newProduct, ...allProducts];
      setAllProducts(updatedAllProducts);
      setFilteredProducts((prev) => [newProduct, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (product) => {
    const previousState = {
      product,
      allProducts,
      filteredProducts,
    };
    const updatedAllProducts = allProducts.filter((p) => p.id !== product.id);
    setAllProducts(updatedAllProducts);
    const updatedFilteredProducts = filteredProducts.filter(
      (p) => p.id !== product.id
    );
    setFilteredProducts(updatedFilteredProducts);
    setUndoData(previousState);
    setTimeout(() => {
      setUndoData(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (undoData) {
      setAllProducts(undoData.allProducts);
      setFilteredProducts(undoData.filteredProducts);
      updateCurrentPageProducts(undoData.filteredProducts, currentPage);
      setUndoData(null);
    }
  };

  const handleSeeAll = () => {
    setSearch("");
    setCategoryFilter("all");
    setFilteredProducts(allProducts);
    setCurrentPage(1);
    updateCurrentPageProducts(allProducts, 1);
  };

  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading && isInitialLoad) {
    return (
      <div className="loading-container">
        <p className="loading">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-products-page">
      <div className="products-header">
        <h2>Products Management</h2>
        <div className="products-info">
          {totalFilteredProducts === 0 ? (
            "No products found"
          ) : (
            <>
              Showing <strong>{showingStart}-{endIndex}</strong> of{" "}
              <strong>{totalFilteredProducts}</strong> products
            </>
          )}
        </div>
        <div className="actions">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="btn filter-select"
          >
            <option value="all">All Categories</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelry</option>
          </select>
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="btn reset-btn" onClick={handleSeeAll}>
            Reset Filters
          </button>
          <button className="btn primary add-btn" onClick={handleAddClick}>
            + Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <form className="product-form" onSubmit={handleSubmit}>
            <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
            <div className="form-group">
              <input
                name="title"
                placeholder="Product Name *"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                name="category"
                placeholder="Category *"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  name="price"
                  type="number"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  name="stock"
                  type="number"
                  placeholder="Stock *"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <input
                name="image"
                placeholder="Image URL *"
                value={formData.image}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button className="btn primary" type="submit">
                {isEditing ? "Update Product" : "Add Product"}
              </button>
              <button
                className="btn cancel-btn"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {undoData && (
        <div className="undo-toast">
          <span>
            Product <strong>"{undoData.product.title}"</strong> has been deleted.
          </span>
          <button className="undo-btn" onClick={handleUndo}>
            Undo
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <div className="no-products-message">
          <p>No products match your search criteria.</p>
          <button className="btn" onClick={handleSeeAll}>
            View All Products
          </button>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th className="product-col">Product</th>
                  <th className="category-col">Category</th>
                  <th className="price-col">Price</th>
                  <th className="stock-col">Stock</th>
                  <th className="status-col">Status</th>
                  <th className="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="product-cell">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="product-img"
                      />
                      <div className="product-info">
                        <span className="product-title">{product.title}</span>
                        <span className="product-id">ID: {product.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td className="price-cell">
                      <strong>${product.price.toFixed(2)}</strong>
                    </td>
                    <td>
                      <div className="stock-info">
                        <span className={`stock-badge ${
                          product.stock > 20 ? "in-stock" : 
                          product.stock > 0 ? "low-stock" : "out-of-stock"
                        }`}>
                          {product.stock} units
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge active">
                        {product.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        className="btn small edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn small delete-btn"
                        onClick={() => handleDelete(product)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn prev-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ← Previous
              </button>
              <div className="page-numbers">
                {generatePageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-btn ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                className="pagination-btn next-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next →
              </button>
              <div className="page-info">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}