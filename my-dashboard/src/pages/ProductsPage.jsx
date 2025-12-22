import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../service/api";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();
      setProducts(data || []);
    };
    load();
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const start = (page - 1) * perPage;
  const visible = products.slice(start, start + perPage);


  const handleViewProduct = (product) => {
    navigate(`/product/${product.id}`, { 
      state: { product } 
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2>Our Products</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Browse our collection of {products.length} products across {categories.length} categories
        </p>
      </div>
    
      <div className="grid" style={{ marginTop: 12, marginBottom: 20 }}>
        <div className="card">
          <h4>Total Products</h4>
          <div className="price">{products.length}</div>
        </div>

        <div className="card">
          <h4>Categories</h4>
          <div className="price">{categories.length}</div>
        </div>

        <div className="card">
          <h4>Recently Added</h4>
          <div className="price">{products[0]?.title || "-"}</div>
        </div>
      </div>

      <div className="grid">
        {visible.map((p) => (
          <div className="card" key={p.id}>
            <div className="product-card">
              <div className="product-image-container">
                <img src={p.image} alt={p.title} className="product-image" />
              </div>
              
              <div className="product-content">
                <h3 className="product-title">{p.title}</h3>
                <p className="product-price">${p.price?.toFixed(2)}</p>
                <span className="product-category">{p.category}</span>
       
                <div className="card-actions" style={{ marginTop: '15px' }}>
                  <button 
                    className="view-btn"
                    onClick={() => handleViewProduct(p)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#2c3e50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ padding: 20, color: "var(--muted)", textAlign: 'center' }}>
          No products found.
        </div>
      )}

      {products.length > perPage && (
        <div className="pagination" style={{ marginTop: 20 }}>
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={`page-btn ${page === num ? "active" : ""}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}