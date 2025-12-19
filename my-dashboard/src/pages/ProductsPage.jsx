import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../service/api";

// Helper function for localStorage
const storage = {
  saveProducts: (products) => {
    try {
      localStorage.setItem('my_ecommerce_products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  loadProducts: () => {
    try {
      const saved = localStorage.getItem('my_ecommerce_products');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // ⭐ NEW: Admin mode state
  const [localProducts, setLocalProducts] = useState([]); // ⭐ NEW: Products you add
  const [showForm, setShowForm] = useState(false); // ⭐ NEW: Control form visibility

  const [page, setPage] = useState(1);
  const perPage = 8; 

  // Load both API products and your local products
  useEffect(() => {
    load();
    // Load your local products from localStorage
    const savedProducts = storage.loadProducts();
    setLocalProducts(savedProducts);
  }, []);

  // Save local products whenever they change
  useEffect(() => {
    storage.saveProducts(localProducts);
  }, [localProducts]);

  const load = async () => {
    const data = await getProducts();
    setProducts(data || []);
  };

  // ⭐ NEW: Handle saving products YOU add
  const handleSave = async (payload) => {
    if (editing && editing.id) {
      // Editing existing product
      if (editing.isLocal) {
        // Editing a product you added
        setLocalProducts(prev => 
          prev.map(p => p.id === editing.id ? { ...payload, id: editing.id, isLocal: true } : p)
        );
      } else {
        // Editing API product (if you want to allow this)
        await updateProduct(editing.id, payload);
        load();
      }
    } else {
      // Adding NEW product (you add from your device)
      const newProduct = {
        ...payload,
        id: Date.now(), // Simple ID
        isLocal: true, // Mark as your product
        addedBy: 'you' // Track who added it
      };
      
      // Add to your local products
      setLocalProducts(prev => [...prev, newProduct]);
    }
    
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id, isLocal = false) => {
    if (isLocal) {
      // Delete product you added
      setLocalProducts(prev => prev.filter(p => p.id !== id));
    } else {
      // Delete API product
      await deleteProduct(id);
      load();
    }
  };

  // ⭐ NEW: Combine API products and your local products
  const allProducts = [...localProducts, ...products];
  
  const categories = [...new Set(allProducts.map((p) => p.category))];

  
  const totalPages = Math.max(1, Math.ceil(allProducts.length / perPage));
  const start = (page - 1) * perPage;
  const visible = allProducts.slice(start, start + perPage);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Manage Products</h2>
        
        {/* ⭐ NEW: Admin Mode Toggle */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            style={{
              padding: '8px 16px',
              background: isAdmin ? '#4a6cf7' : '#f0f0f0',
              color: isAdmin ? 'white' : '#333',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 500,
              border: isAdmin ? '2px solid #4a6cf7' : '2px solid #ddd'
            }}
          >
            {isAdmin ? '👑 Admin Mode ON' : '🔧 Enter Admin Mode'}
          </button>
          
          {/* ⭐ NEW: Show Add button only in admin mode */}
          {isAdmin && (
            <button
              className="icon-btn"
              onClick={() => {
                setEditing({});
                setShowForm(true);
              }}
              style={{ 
                background: "var(--brand)", 
                color: "#fff",
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + Add Product
            </button>
          )}
        </div>
      </div>

      {/* ⭐ NEW: Admin Info Banner */}
      {isAdmin && (
        <div style={{
          background: '#e8f4ff',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #b6d4fe',
          color: '#084298'
        }}>
          <strong>👑 Admin Mode Active</strong> - You can add, edit, and delete products. 
          Products you add will be saved in your browser's storage.
          {localProducts.length > 0 && ` You have added ${localProducts.length} product(s).`}
        </div>
      )}
    
      <div className="grid" style={{ marginTop: 12, marginBottom: 20 }}>
        <div className="card">
          <h4>Total Products</h4>
          <div className="price">{allProducts.length}</div>
          {localProducts.length > 0 && (
            <small style={{ color: '#666', fontSize: '12px' }}>
              ({localProducts.length} added by you)
            </small>
          )}
        </div>

        <div className="card">
          <h4>Categories</h4>
          <div className="price">{categories.length}</div>
        </div>

        <div className="card">
          <h4>Recently Added</h4>
          <div className="price">{allProducts[0]?.title || "-"}</div>
          {allProducts[0]?.isLocal && (
            <small style={{ color: '#4a6cf7', fontSize: '12px' }}>
              (Added by you)
            </small>
          )}
        </div>
      </div>

     
      {/* ⭐ UPDATED: Show form as modal/popup */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <ProductForm
            initialData={editing}
            onSubmit={handleSave}
            onCancel={() => {
              setEditing(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

   
      <div className="grid">
        {visible.map((p) => (
          <div className="card" key={p.id} style={{ position: 'relative' }}>
            {/* ⭐ NEW: Badge for products you added */}
            {p.isLocal && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#4a6cf7',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 'bold',
                zIndex: 1
              }}>
                YOURS
              </div>
            )}
            
            <ProductCard
              product={p}
              onEdit={() => {
                setEditing(p);
                setShowForm(true);
              }}
              onDelete={() => handleDelete(p.id, p.isLocal)}
              isAdmin={isAdmin} // ⭐ NEW: Pass admin mode to ProductCard
            />
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ padding: 20, color: "var(--muted)", textAlign: 'center' }}>
          No products found. {isAdmin && "Click 'Add Product' to add your first product!"}
        </div>
      )}

 
      {allProducts.length > perPage && (
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
      
      {/* ⭐ NEW: Clear Local Products Button (Admin only) */}
      {isAdmin && localProducts.length > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            onClick={() => {
              if (window.confirm('Clear all products you added? This cannot be undone.')) {
                setLocalProducts([]);
                localStorage.removeItem('my_ecommerce_products');
              }
            }}
            style={{
              padding: '10px 20px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Clear All Products You Added
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            This will only remove products you added, not the API products.
          </p>
        </div>
      )}
    </div>
  );
}