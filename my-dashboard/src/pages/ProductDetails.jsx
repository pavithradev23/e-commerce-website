import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading product details...
      </div>
    );
  }

  const isWishlisted = wishlist.some((p) => p.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.breadcrumb}>
        <span 
          style={styles.breadcrumbLink}
          onClick={() => navigate('/store')}
        >
          Store
        </span>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span 
          style={styles.breadcrumbLink}
          onClick={() => navigate(`/store/${product.category}`)}
        >
          {product.category}
        </span>
        <span style={styles.breadcrumbSeparator}>/</span>
        <span style={styles.breadcrumbCurrent}>{product.title}</span>
      </div>

      <div style={styles.productCard}>
   
        <button
          onClick={() => navigate(-1)}
          style={styles.closeButton}
        >
          ✕
        </button>

     
        <div style={styles.productContent}>
         
          <div style={styles.imageSection}>
            <img
              src={product.image}
              alt={product.title}
              style={styles.productImage}
            />
            <div style={styles.imageBadges}>
              <span style={styles.badge}>Free Shipping</span>
              <span style={styles.badge}>30-Day Returns</span>
            </div>
          </div>


          <div style={styles.detailsSection}>
            <span style={styles.category}>{product.category.toUpperCase()}</span>
            <h1 style={styles.title}>{product.title}</h1>
            
            <div style={styles.rating}>
              {'★'.repeat(4)}<span style={{ color: '#ccc' }}>★</span>
              <span style={styles.ratingText}>(4.5/5)</span>
            </div>

            <div style={styles.priceSection}>
              <h2 style={styles.price}>${product.price.toFixed(2)}</h2>
              <span style={styles.taxText}>+ applicable taxes</span>
            </div>

   
            <div style={styles.quantitySection}>
              <label style={styles.quantityLabel}>Quantity:</label>
              <div style={styles.quantityControls}>
                <button 
                  style={styles.quantityBtn}
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span style={styles.quantityValue}>{quantity}</span>
                <button 
                  style={styles.quantityBtn}
                  onClick={() => handleQuantityChange('increase')}
                >
                  +
                </button>
              </div>
            </div>

           
            <div style={styles.descriptionSection}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.description}>{product.description}</p>
            </div>

           
            <div style={styles.actionButtons}>
              <button 
                style={styles.addToCartButton}
                onClick={handleAddToCart}
              >
                🛒 Add to Cart {quantity > 1 && `(${quantity})`}
              </button>
              
              <button 
                style={{
                  ...styles.wishlistButton,
                  background: isWishlisted ? '#ff6b6b' : '#f8f9fa',
                  color: isWishlisted ? 'white' : '#333',
                  border: isWishlisted ? 'none' : '1px solid #ddd'
                }}
                onClick={() => toggleWishlist(product)}
              >
                {isWishlisted ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
              </button>

              <button 
                style={styles.buyNowButton}
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
              >
                ⚡ Buy Now
              </button>
            </div>

       
            <div style={styles.features}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🚚</span>
                <div>
                  <strong>Free Shipping</strong>
                  <p style={styles.featureText}>On orders over $50</p>
                </div>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>↩️</span>
                <div>
                  <strong>Easy Returns</strong>
                  <p style={styles.featureText}>30-day return policy</p>
                </div>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🔒</span>
                <div>
                  <strong>Secure Payment</strong>
                  <p style={styles.featureText}>100% secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div style={styles.relatedSection}>
        <h2 style={styles.relatedTitle}>You May Also Like</h2>
        <div style={styles.relatedGrid}>
          
          <div style={styles.relatedPlaceholder}>
            <p>More products in <strong>{product.category}</strong></p>
            <button 
              style={styles.viewMoreButton}
              onClick={() => navigate(`/store/${product.category}`)}
            >
              View All {product.category}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#fff',
    minHeight: '100vh',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '30px',
    fontSize: '14px',
    color: '#666',
  },
  breadcrumbLink: {
    color: '#3498db',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  breadcrumbSeparator: {
    color: '#999',
  },
  breadcrumbCurrent: {
    color: '#333',
    fontWeight: '500',
  },
  productCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    padding: '30px',
    position: 'relative',
    marginBottom: '40px',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  productContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    alignItems: 'start',
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  productImage: {
    width: '100%',
    height: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
    background: '#f8f9fa',
    padding: '20px',
  },
  imageBadges: {
    display: 'flex',
    gap: '10px',
  },
  badge: {
    background: '#2ecc71',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  category: {
    color: '#3498db',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0',
    lineHeight: '1.3',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: '#f39c12',
    fontSize: '18px',
  },
  ratingText: {
    fontSize: '14px',
    color: '#666',
    marginLeft: '8px',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
  },
  price: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0',
  },
  taxText: {
    fontSize: '14px',
    color: '#666',
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '10px',
  },
  quantityLabel: {
    fontWeight: '600',
    color: '#333',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  quantityBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    background: 'white',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  quantityValue: {
    width: '40px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '16px',
  },
  descriptionSection: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#555',
    margin: '0',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '30px',
  },
  addToCartButton: {
    padding: '16px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  wishlistButton: {
    padding: '14px',
    background: '#f8f9fa',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  buyNowButton: {
    padding: '16px',
    background: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  featureIcon: {
    fontSize: '20px',
  },
  featureText: {
    fontSize: '13px',
    color: '#666',
    margin: '2px 0 0 0',
  },
  relatedSection: {
    marginTop: '40px',
  },
  relatedTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  relatedPlaceholder: {
    background: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
    gridColumn: '1 / -1',
  },
  viewMoreButton: {
    padding: '10px 20px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '15px',
    fontWeight: '600',
  },
};

// Add hover effects
Object.assign(styles.closeButton, {
  ':hover': {
    background: '#f5f5f5',
    color: '#333',
  }
});

Object.assign(styles.addToCartButton, {
  ':hover': {
    background: '#2980b9',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(52, 152, 219, 0.3)',
  }
});

Object.assign(styles.wishlistButton, {
  ':hover': {
    background: '#e9ecef',
  }
});

Object.assign(styles.buyNowButton, {
  ':hover': {
    background: '#1a252f',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(44, 62, 80, 0.3)',
  }
});

Object.assign(styles.quantityBtn, {
  ':hover': {
    borderColor: '#3498db',
    color: '#3498db',
  }
});