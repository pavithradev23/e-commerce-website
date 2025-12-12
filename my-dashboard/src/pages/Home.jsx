import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useShop } from "../context/ShopContext";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

const { toggleWishlist, wishlist, addToCart, cart } = useShop();

 
  const categoryImages = {
    electronics:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    jewelery:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80",
    "men's clothing":
      "https://images.unsplash.com/photo-1602810320073-1230c46d89d4?w=600&q=80",
    "women's clothing":
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
  };

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch("https://fakestoreapi.com/products?limit=4")
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data));
  }, []);

  return (
    <div className="home-page">
<section className="hero-wrapper">

  <div className="hero-left">
    <img
      src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80"
      alt="Hero Banner"
      className="hero-img"
    />

    <div className="hero-overlay">
      <h1 className="hero-title">Mega Discounts</h1>
      <p className="hero-sub">Shop top brands with exclusive offers.</p>
      <button className="hero-btn" onClick={() => navigate("/reports")}>
        Shop Now →
      </button>
    </div>
  </div>

  <div className="hero-right">

    <div className="promo-card-img">
      <img
        src="https://images.unsplash.com/photo-1551854838-212c50b4c184?w=500&q=80"
        alt="Clothing"
      />
      <div className="promo-info">
        <h4>Clothing</h4>
        <p>Extra <strong>30% Off</strong> All Sale Styles</p>
      </div>
    </div>

    <div className="promo-card-img">
      <img
        src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80"
        alt="Beauty"
      />
      <div className="promo-info">
        <h4>Beauty</h4>
        <p>20% Off or More Beauty Products</p>
      </div>
    </div>

    <div className="promo-card-img">
      <img
        src="https://images.unsplash.com/photo-1593344484962-796055d4a3a4?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZWxlY3Ryb25pY3N8ZW58MHx8MHx8fDA%3D"
        alt="Electronics"
      />
      <div className="promo-info">
        <h4>Electronics</h4>
        <p>Smart Home, Appliances & More</p>
      </div>
    </div>

  </div>

  
</section>

     
      <h2 className="section-heading">Categories of the Week</h2>

      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat}
            className="category-card"
            onClick={() => navigate(`/category/${cat}`)}
          >
            <img
              src={categoryImages[cat]}
              alt={cat}
              className="category-img"
            />
            <div className="category-name">{cat.toUpperCase()}</div>
          </div>
        ))}
      </div>

     
      

  <h2 className="section-heading">Featured Products</h2>

<div className="product-grid">
  {featuredProducts.map((p) => {
    const isWishlisted = wishlist.some((w) => w.id === p.id);

   
    const isAdded = cart.some((c) => c.id === p.id);

    return (
      <div className="product-card" key={p.id}>

        <button
          className="wishlist-btn"
          onClick={() => toggleWishlist(p)}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

        <img src={p.image} alt={p.title} className="product-img" />

        <h4 className="product-title">{p.title}</h4>
        <p className="product-price">${p.price}</p>

       
        <button
          className="product-btn"
          onClick={() => addToCart(p)}
          style={{
            background: isAdded ? "#2ecc71" : "#000",
            color: "#fff",
            transition: "0.3s",
          }}
          disabled={isAdded} 
        >
          {isAdded ? "✔ Added to Cart" : "Add to Cart"}
        </button>

      </div>
    );
  })}
</div>

    </div>
  );
}
