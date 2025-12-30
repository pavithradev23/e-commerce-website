import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider"; 
import { getProducts } from "../service/api";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 8;

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/store");
      navigate("/login");
      return;
    }

    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: "60px 20px", 
        textAlign: "center",
        minHeight: "50vh"
      }}>
        <h3>Checking authentication...</h3>
        <p>Redirecting to login...</p>
      </div>
    );
  }

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
      <div style={{ 
        marginBottom: 30, 
        padding: "20px", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: 12,
        color: "white"
      }}>
        <h2 style={{ margin: 0 }}>Our Products</h2>
        <p style={{ marginTop: 8, opacity: 0.9 }}>
          Welcome, <strong>{user?.name}</strong>! Browse our collection of {products.length} products
        </p>
        <div style={{ 
          display: "flex", 
          gap: 15, 
          marginTop: 15,
          fontSize: 14
        }}>
          <span>👤 Role: {user?.role || "User"}</span>
          <span>📦 Categories: {categories.length}</span>
        </div>
      </div>
    
      <div className="grid" style={{ marginBottom: 30 }}>
        <div className="card">
          <h4>Total Products</h4>
          <div className="price">{loading ? "..." : products.length}</div>
          <small>Available for purchase</small>
        </div>

        <div className="card">
          <h4>Categories</h4>
          <div className="price">{loading ? "..." : categories.length}</div>
          <small>Different types</small>
        </div>

        <div className="card">
          <h4>Your Access</h4>
          <div className="price" style={{ fontSize: 14 }}>
            {user?.role === "admin" ? "Full Access" : "Shopping Access"}
          </div>
          <small>JWT Verified</small>
        </div>
      </div>

  
      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px 20px",
          background: "#f8f9fa",
          borderRadius: 12
        }}>
          <p>Loading products...</p>
          <p>Please wait while we fetch the latest products.</p>
        </div>
      ) : (
        <>
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

         
          {visible.length === 0 && !loading && (
            <div style={{ 
              padding: 40, 
              textAlign: 'center',
              background: "#f8f9fa",
              borderRadius: 12
            }}>
              <p style={{ fontSize: 18, marginBottom: 10 }}>No products found.</p>
              <p style={{ color: '#666' }}>Try refreshing the page or check back later.</p>
            </div>
          )}

         
          {products.length > perPage && !loading && (
            <div className="pagination" style={{ marginTop: 30 }}>
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
        </>
      )}

      
      <div style={{ 
        marginTop: 30, 
        padding: "15px", 
        background: "#e8f5e9", 
        borderRadius: 8,
        fontSize: 14,
        color: "#2e7d32",
        textAlign: "center"
      }}>
        <p style={{ margin: 0 }}>
          🔐 <strong>Secure Access:</strong> This page is protected with JWT authentication. 
          Your session is valid and active.
        </p>
      </div>
    </div>
  );
}