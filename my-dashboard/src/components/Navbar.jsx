import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { cart } = useShop();
  const cartCount = cart.reduce((total, item) => total + (item.qty || 1), 0);

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>Yozishop</Link>
      
      <div style={linksStyle}>
        <Link to="/store" style={linkStyle}>Store</Link>
        <Link to="/cart" style={cartLinkStyle}>
          🛒 Cart
          {cartCount > 0 && (
            <span style={badgeStyle}>{cartCount}</span>
          )}
        </Link>
        <Link to="/orders" style={linkStyle}>Orders</Link>
      </div>
    </nav>
  );
}

const navbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  textDecoration: 'none',
};

const linksStyle = {
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#555',
  padding: '8px 16px',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
};

const cartLinkStyle = {
  ...linkStyle,
  position: 'relative',
};

const badgeStyle = {
  position: 'absolute',
  top: '-5px',
  right: '5px',
  backgroundColor: '#e74c3c',
  color: 'white',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 'bold',
};