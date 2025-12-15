import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import Undo from "../components/Undo";
import { useShop } from "../context/ShopContext";

import {
  getProducts as apiGet,
  createProduct as apiCreate,
  updateProduct as apiUpdate,
  deleteProduct as apiDelete,
} from "../service/api";

export default function Reports() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const { searchTerm } = useShop();   

  const categorySlug = params?.slug || searchParams.get("category") || "all";

  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingDeletes, setPendingDeletes] = useState([]);
  const [page, setPage] = useState(1);
  const [viewProduct, setViewProduct] = useState(null);

  const perPage = 8;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiGet();
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let list = [...products];

    const lower = (categorySlug || "all").toLowerCase();

    if (lower !== "all") {
      list = list.filter((p) =>
        (p.category || "").toLowerCase().includes(lower)
      );
    }

    if (searchTerm.trim() !== "") {
      list = list.filter((p) =>
        (p.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setVisibleProducts(list);
    setPage(1);
  }, [products, categorySlug, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / perPage));
  const start = (page - 1) * perPage;
  const visible = visibleProducts.slice(start, start + perPage);

  const handleSave = async (payload) => {
    if (editing && editing.id) {
      try {
        await apiUpdate(editing.id, payload);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editing.id ? { ...p, ...payload } : p
          )
        );
      } catch (err) {
        console.error(err);
      }
    } else if (editing) {
      try {
        const created = await apiCreate(payload);
        const item = created?.id ? created : { id: Date.now(), ...payload };
        setProducts((prev) => [item, ...prev]);
      } catch (err) {
        console.error(err);
      }
    }

    setEditing(null);
  };

  const handleDelete = (id) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));

    setPendingDeletes((prev) => [
      ...prev,
      { id, item, expiresAt: Date.now() + 7000 },
    ]);

    setTimeout(async () => {
      try {
        await apiDelete(id);
      } catch (err) {
        console.error(err);
        setProducts((prev) => [item, ...prev]);
      }

      setPendingDeletes((prev) => prev.filter((x) => x.id !== id));
    }, 7000);
  };

  const undo = (id) => {
    const entry = pendingDeletes.find((x) => x.id === id);
    if (!entry) return;

    setProducts((prev) => [entry.item, ...prev]);
    setPendingDeletes((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 className="store-title">
  {categorySlug === "all"
    ? "Store — All Products"
    : `Store — ${categorySlug}`}
</h2>


       
      </div>

      <div className={`product-form-container ${editing ? "show" : ""}`}>
        {editing && (
          <ProductForm
            onSubmit={handleSave}
            initialData={editing?.id ? editing : {}}
            onCancel={() => setEditing(null)}
          />
        )}
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <>
          <div className="grid">
            {visible.map((p) => (
              <div key={p.id} className="card">
                <ProductCard
                  product={p}
                  onEdit={() => setEditing(p)}
                  onDelete={() => handleDelete(p.id)}
                  onView={() => setViewProduct(p)}
                />
              </div>
            ))}

            {visible.length === 0 && (
              <div style={{ padding: 20, color: "var(--muted)" }}>
                No products found.
              </div>
            )}
          </div>

          <div className="pagination" style={{ marginTop: 20 }}>
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, page - 3),
                Math.min(totalPages, page + 2)
              )
              .map((n) => (
                <button
                  key={n}
                  className={`page-btn ${n === page ? "active" : ""}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}

            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      <Undo items={pendingDeletes} onUndo={undo} />

      {viewProduct && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px 35px",
              width: 360,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <img
              src={viewProduct.image}
              alt={viewProduct.title}
              style={{ width: "100%", height: 180, objectFit: "contain" }}
            />

            <h2 style={{ marginTop: 10 }}>{viewProduct.title}</h2>
            <p style={{ margin: "10px 0", fontWeight: "bold" }}>
              ${viewProduct.price}
            </p>

            <button
              onClick={() => setViewProduct(null)}
              style={{
                marginTop: 15,
                padding: "10px 20px",
                background: "#000",
                color: "#fff",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

