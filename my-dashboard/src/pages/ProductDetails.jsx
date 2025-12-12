import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const isWishlisted = wishlist.some((p) => p.id === product.id);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", position: "relative" }}>

     
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "transparent",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
        }}
      >
        ✖
      </button>

      <h1>{product.title}</h1>

      <img
        src={product.image}
        style={{ width: 300, objectFit: "contain" }}
      />

      <h2>${product.price}</h2>
      <p>{product.description}</p>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>

      <button onClick={() => toggleWishlist(product)}>
        {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
}

