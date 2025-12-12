import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
function ProductModal({ product, onClose }) {

  const { addToCart } = useShop();   

  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <button className="modal-close" onClick={onClose}>✖</button>

        <img src={product.image} alt={product.title} className="modal-img" />

        <h2>{product.title}</h2>
        <p className="modal-desc">{product.description}</p>

        <h3 className="modal-price">${product.price}</h3>

       
        <button
          className="icon-btn"
          style={{ width: "100%", marginTop: 10 }}
          onClick={() => {
            addToCart(product); 
            onClose();          
          }}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default function Wishlist() {
  const { wishlist } = useShop();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div>
      <h1>Wishlist</h1>

      <div className="wishlist-grid">
        {wishlist.map((p) => (
          <div className="wishlist-item" key={p.id}>
            <img src={p.image} alt={p.title} />

            <h4>{p.title}</h4>

            <button
              className="icon-btn"
              onClick={() => setSelectedProduct(p)}
            >
              View
            </button>
          </div>
        ))}
      </div>
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

