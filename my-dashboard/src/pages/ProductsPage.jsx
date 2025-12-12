import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../service/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const [page, setPage] = useState(1);
  const perPage = 8; 

  const load = async () => {
    const data = await getProducts();
    setProducts(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (payload) => {
    if (editing && editing.id) {
      await updateProduct(editing.id, payload);
    } else {
      await createProduct(payload);
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    load();
  };

  const categories = [...new Set(products.map((p) => p.category))];

  
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const start = (page - 1) * perPage;
  const visible = products.slice(start, start + perPage);

  return (
    <div>
      <h2>Manage Products</h2>

    
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

      
      <div style={{ marginBottom: 10 }}>
        <button
          className="icon-btn"
          onClick={() => setEditing({})}
          style={{ background: "var(--brand)", color: "#fff" }}
        >
          + Add Product
        </button>
      </div>

     
      <div className={`product-form-container ${editing ? "show" : ""}`}>
        {editing && (
          <ProductForm
            initialData={editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </div>

   
      <div className="grid">
        {visible.map((p) => (
          <div className="card" key={p.id}>
            <ProductCard
              product={p}
              onEdit={() => setEditing(p)}
              onDelete={() => handleDelete(p.id)}
            />
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div style={{ padding: 20, color: "var(--muted)" }}>
          No products found.
        </div>
      )}

 
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
    </div>
  );
}

