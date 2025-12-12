import React from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function ProductCard({ product, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { cart, addToCart, toggleWishlist, wishlist } = useShop();

  const inCart = cart.find((c) => c.id === product.id);
  const isWished = wishlist.some((w) => w.id === product.id);

  return (
    <div className="product-card" style={{ position: "relative" }}>

      <button
        className="wishlist-btn"
        onClick={() => toggleWishlist(product)}
      >
        {isWished ? "❤️" : "🤍"}
      </button>

     
      <img
        src={product.image}
        alt={product.title}
        className="product-img"
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ cursor: "pointer" }}
      />

      <h4 className="product-title">{product.title}</h4>
      <p className="product-price">${product.price}</p>

  
      {!inCart ? (
        <button
          className="product-btn"
          style={{
            background: "#000",
            color: "#fff",
            marginTop: 8
          }}
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      ) : (
        <button
          className="product-btn"
          style={{
            background: "#4CAF50",
            color: "#fff",
            marginTop: 8,
            cursor: "default"
          }}
          disabled
        >
          ✓ Added to Cart
        </button>
      )}

      {(onEdit || onDelete) && (
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {onEdit && (
            <button
              className="product-btn small-btn black"
              onClick={onEdit}
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              className="product-btn small-btn delete"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
