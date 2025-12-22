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
  const categoryParam = params?.category;
  const categorySlug = categoryParam || searchParams.get("category") || "all";
  
  console.log("Category from URL:", categoryParam);
  console.log("Final category slug:", categorySlug);

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
        console.log("Loaded products:", data?.length || 0);
        console.log("Unique categories in products:", [...new Set(data?.map(p => p.category) || [])]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let list = [...products];

    const lowerCategory = (categorySlug || "all").toLowerCase().trim();
    
    console.log(`Filtering by category: "${lowerCategory}"`);
    console.log("Total products available:", list.length);


    if (lowerCategory !== "all") {
      const originalCount = list.length;
      
      const categoryMapping = {
        'electronics': ['electronics', 'electronic', 'tech', 'technology'],
        'jewelery': ['jewelery', 'jewelry', 'jewellery', 'accessories'],
        'men': ['men', "men's", 'mens', "men's clothing", 'men clothing', "men's fashion", 'menswear'],
        'women': ['women', "women's", 'womens', "women's clothing", 'women clothing', "women's fashion", 'womenswear']
      };

      list = list.filter((product) => {
        const productCategory = (product.category || "").toLowerCase().trim();
        
        if (productCategory === lowerCategory) {
          console.log(`Exact match: ${product.title} -> ${productCategory}`);
          return true;
        }
       
        if (productCategory.includes(lowerCategory)) {
          console.log(`Includes match: ${product.title} -> ${productCategory} includes ${lowerCategory}`);
          return true;
        }
        
        if (lowerCategory.includes(productCategory)) {
          console.log(`Reverse includes: ${lowerCategory} includes ${productCategory}`);
          return true;
        }
        if (categoryMapping[lowerCategory]) {
          const hasMatch = categoryMapping[lowerCategory].some(variation => 
            productCategory.includes(variation) || variation.includes(productCategory)
          );
          if (hasMatch) {
            console.log(`Category variation match: ${product.title} -> ${productCategory} matches ${lowerCategory}`);
            return true;
          }
        }
        
        return false;
      });
      
      console.log(`Filtered products: ${originalCount} -> ${list.length}`);
    }

 
    if (searchTerm && searchTerm.trim() !== "") {
      const beforeSearch = list.length;
      const searchLower = searchTerm.toLowerCase().trim();
      list = list.filter((p) =>
        (p.title || "").toLowerCase().includes(searchLower) ||
        (p.description || "").toLowerCase().includes(searchLower) ||
        (p.category || "").toLowerCase().includes(searchLower)
      );
      console.log(`After search "${searchTerm}": ${beforeSearch} -> ${list.length}`);
    }

    console.log("Final visible products:", list.length);
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


  const formatCategoryName = (slug) => {
    if (slug === "all") return "All Products";
    
    const names = {
      'electronics': 'Electronics',
      'jewelery': 'Jewellery',
      'men': "Men's Clothing",
      'women': "Women's Clothing"
    };
    
    return names[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
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
          Store — {formatCategoryName(categorySlug)}
          {visibleProducts.length > 0 && ` (${visibleProducts.length} products)`}
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
          {categorySlug !== "all" && (
            <div style={{ marginBottom: 20 }}>
              <p>
                <a href="/store" style={{ color: '#666', textDecoration: 'none' }}>
                  All Products
                </a>
                <span style={{ margin: '0 8px' }}>›</span>
                <span style={{ fontWeight: 'bold' }}>
                  {formatCategoryName(categorySlug)}
                </span>
              </p>
            </div>
          )}

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
              <div style={{ padding: 40, color: "var(--muted)", textAlign: 'center' }}>
                <h3>No products found</h3>
                <p>
                  {categorySlug !== "all" 
                    ? `No products found in "${formatCategoryName(categorySlug)}" category.`
                    : "Try adjusting your search or filters."}
                </p>
                {categorySlug !== "all" && (
                  <a 
                    href="/store" 
                    style={{ 
                      display: 'inline-block', 
                      marginTop: 10,
                      padding: '8px 16px',
                      background: '#6366f1',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: 6
                    }}
                  >
                    View All Products
                  </a>
                )}
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
            <p style={{ color: '#666', fontSize: 14 }}>
              Category: {viewProduct.category}
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