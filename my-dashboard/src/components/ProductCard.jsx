import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom'; 

export default function ProductCard({ product, isAdmin, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({...product});
  const navigate = useNavigate(); 
  
  const { cart, addToCart, removeFromCart } = useShop();
  
  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.qty || 0;

  const handleSave = () => {
    onUpdate(editedProduct);
    setIsEditing(false);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  const handleCartToggle = () => {
    if (isInCart) {
      handleRemoveFromCart();
    } else {
      handleAddToCart();
    }
  };


  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      <div 
        className="product-image-container"
        onClick={handleViewProduct}
        style={{ cursor: 'pointer' }}
      >
        <img src={product.image} alt={product.title} className="product-image" />
        {isAdmin && (
          <div className="admin-badge">ADMIN</div>
        )}
      </div>

      {isEditing ? (
        <div className="edit-form">
          <input
            className="edit-input"
            value={editedProduct.title}
            onChange={(e) => setEditedProduct({...editedProduct, title: e.target.value})}
            placeholder="Product Title"
          />
          <input
            className="edit-input"
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({...editedProduct, price: parseFloat(e.target.value)})}
            placeholder="Price"
          />
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="product-content">
          <h3 
            className="product-title"
            onClick={handleViewProduct}
            style={{ cursor: 'pointer' }}
          >
            {product.title}
          </h3>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <span className="product-category">{product.category}</span>
          
          <div className="card-actions">
            {isAdmin ? (
              <div className="admin-actions">
                <button 
                  className="admin-btn edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="admin-btn delete-btn"
                  onClick={onDelete}
                >
                  🗑️ Delete
                </button>
              </div>
            ) : (
              <div className="user-actions">
                <button 
                  className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
                  onClick={handleCartToggle}
                >
                  {isInCart ? (
                    <>
                      <span className="cart-icon">✓</span>
                      {cartQuantity > 1 ? `Added (${cartQuantity})` : 'Added to Cart'}
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button 
                  className="view-details-btn"
                  onClick={handleViewProduct}
                >
                  👁️ View Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}