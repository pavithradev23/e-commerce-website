import React, { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";

export default function Products() {
  const { searchTerm, addToWishlist, addToCart } = useShop();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
r
  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-grid">
      {filtered.map((p) => (
        <div className="product-card" key={p.id}>
          <img src={p.image} alt={p.title} />

          <h4>{p.title}</h4>
          <p>${p.price}</p>

          <div className="product-actions">
            <button onClick={() => addToCart(p)}>Add to Cart</button>
            <button onClick={() => addToWishlist(p)}>❤️ Wishlist</button>
          </div>
        </div>
      ))}
    </div>
  );
}

