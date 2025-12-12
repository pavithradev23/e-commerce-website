import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="cols">
        <div>
          <h4>YoziShop</h4>
          <p style={{color:'var(--muted)'}}>Shop events & deals. Fast shipping and returns.</p>
        </div>
        <div>
          <h5>Shop</h5>
          <a href="/reports">All Products</a>
          <br />
          <a href="/reports">New Arrivals</a>
        </div>
        <div>
          <h5>Help</h5>
          <a href="#">Shipping</a><br />
          <a href="#">Returns</a>
        </div>
        <div>
          <h5>Company</h5>
          <a href="#">About</a><br />
          <a href="#">Careers</a>
        </div>
      </div>

      <div style={{textAlign:'center', marginTop:18, color:'var(--muted)'}}>© {year} YoziShop — All rights reserved.</div>
    </footer>
  );
}
