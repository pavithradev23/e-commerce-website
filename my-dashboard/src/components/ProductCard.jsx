// src/components/ProductCard.jsx
import React, { useState } from 'react';

export default function ProductCard({ product, isAdmin, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({...product});

  const handleSave = () => {
    onUpdate(editedProduct);
    setIsEditing(false);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.title} />
        {isAdmin && (
          <div className="admin-badge">ADMIN</div>
        )}
      </div>

      {isEditing ? (
        // Edit mode
        <div className="edit-form">
          <input
            value={editedProduct.title}
            onChange={(e) => setEditedProduct({...editedProduct, title: e.target.value})}
          />
          <input
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({...editedProduct, price: parseFloat(e.target.value)})}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        // Display mode
        <>
          <h3>{product.title}</h3>
          <p className="price">${product.price.toFixed(2)}</p>
          <p className="category">{product.category}</p>
          <p className="stock">Stock: {product.stock}</p>
          
          <div className="card-actions">
            {isAdmin ? (
              // Admin actions
              <div className="admin-actions">
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={onDelete}
                >
                  🗑️ Delete
                </button>
              </div>
            ) : (
              // User actions
              <button className="add-to-cart">
                Add to Cart
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}