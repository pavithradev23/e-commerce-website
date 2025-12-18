import React, { useState, useMemo } from "react";
import { useShop } from "../../context/ShopContext";
import "./Adminorders.css";

export default function AdminOrders() {
  const { orders, updateOrderStatus, removeOrder } = useShop(); // ADDED removeOrder here
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === "" || 
        order.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        order.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleDeleteOrder = (orderId) => {
    setDeleteConfirm(orderId);
  };

  const confirmDeleteOrder = () => {
    if (deleteConfirm) {
      // ACTUALLY DELETE THE ORDER
      removeOrder(deleteConfirm); // ← THIS IS THE FIX
      
      // Close the modal if it's open for this order
      if (selectedOrder && selectedOrder.id === deleteConfirm) {
        closeModal();
      }
      
      // Clear the confirmation state
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (!orders) {
    return (
      <div style={{ padding: 30, textAlign: 'center' }}>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Delete Order</h3>
            <p>Are you sure you want to delete order #{deleteConfirm}?</p>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button 
                className="btn delete-cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="btn delete-confirm-btn"
                onClick={confirmDeleteOrder} // ← This now calls the actual delete
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">{filteredOrders.length} order(s) found</p>
        </div>
      </div>
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search order ID, product, customer..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select 
            value={statusFilter} 
            onChange={handleStatusFilter}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          
          {(searchTerm || statusFilter !== "all") && (
            <button 
              onClick={handleClearFilters}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Orders will appear here once customers start placing them.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No matching orders</h3>
          <p>Try adjusting your search or filters.</p>
          <button 
            onClick={handleClearFilters}
            className="btn primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{formatDate(order.date)}</span>
                </div>
                <div className="order-header-actions">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <button 
                    className="delete-order-btn"
                    onClick={() => handleDeleteOrder(order.id)}
                    title="Delete Order"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="products-preview">
                {order.items && order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="product-preview-item">
                    <div className="product-image-small">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="image-placeholder-small">📦</div>
                      )}
                    </div>
                    <div className="product-preview-info">
                      <span className="product-name-preview">{item.name || "Product Name"}</span>
                      <span className="product-quantity">Qty: {item.quantity || 1}</span>
                    </div>
                    <span className="product-price">${(item.price || 0).toFixed(2)}</span>
                  </div>
                ))}
                {order.items && order.items.length > 2 && (
                  <div className="more-items">
                    +{order.items.length - 2} more items
                  </div>
                )}
              </div>
              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">${(order.total || 0).toFixed(2)}</span>
                </div>
                <div className="order-actions">
                  {order.status === "Pending" && (
                    <button 
                      className="btn primary small"
                      onClick={() => updateOrderStatus(order.id, "Shipped")}
                    >
                      Ship Order
                    </button>
                  )}
                  {order.status === "Shipped" && (
                    <button 
                      className="btn primary small"
                      onClick={() => updateOrderStatus(order.id, "Delivered")}
                    >
                      Mark Delivered
                    </button>
                  )}
                  <button 
                    className="btn outline small"
                    onClick={() => handleViewOrder(order)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Order #{selectedOrder.id}</h3>
                <p className="modal-subtitle">Placed on {formatDate(selectedOrder.date)} • {selectedOrder.status}</p>
              </div>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="customer-info-section">
                <h4>Customer Information</h4>
                <div className="customer-details">
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{selectedOrder.customerName || "Guest Customer"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{selectedOrder.customerEmail || "No email provided"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{selectedOrder.customerPhone || "No phone provided"}</span>
                  </div>
                </div>
              </div>

              <div className="modal-products-section">
                <h4>Order Items ({selectedOrder.items ? selectedOrder.items.length : 0})</h4>
                <div className="products-list-detailed">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => {
                      const productName = item.name || item.productName || item.title || "Unnamed Product";
                      const productPrice = item.price || item.unitPrice || 0;
                      const productQuantity = item.quantity || item.qty || 1;
                      const productImage = item.image || item.img || item.imageUrl || null;
                      const productSize = item.size || item.variant || null;
                      const productColor = item.color || null;
                      const productSku = item.sku || item.id || `ITEM-${index + 1}`;
                      
                      return (
                        <div key={index} className="product-item-detailed">
                          <div className="product-image-detailed">
                            {productImage ? (
                              <img src={productImage} alt={productName} onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.innerHTML = '<div class="image-placeholder-detailed"><span>📦</span></div>';
                              }} />
                            ) : (
                              <div className="image-placeholder-detailed">
                                <span>📦</span>
                              </div>
                            )}
                          </div>
                          <div className="product-info-detailed">
                            <h5 className="product-title">{productName}</h5>
                            <div className="product-specs">
                              {productSize && <span className="spec">Size: {productSize}</span>}
                              {productColor && <span className="spec">Color: {productColor}</span>}
                              <span className="spec">SKU: {productSku}</span>
                            </div>
                            <div className="product-price-row">
                              <span className="price">${productPrice.toFixed(2)}</span>
                              <span className="quantity">× {productQuantity}</span>
                              <span className="subtotal">
                                ${(productPrice * productQuantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-items">
                      <p>No items found in this order.</p>
                    </div>
                  )}
                </div>
              </div>

            
              <div className="order-summary-detailed">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>${(selectedOrder.shipping || 0).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${(selectedOrder.tax || 0).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="grand-total">${(selectedOrder.total || 0).toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div className="shipping-info-section">
                  <h4>Shipping Address</h4>
                  <div className="address-details">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button 
                  className="btn danger"
                  onClick={() => handleDeleteOrder(selectedOrder.id)} // Just shows confirmation
                >
                  Delete Order
                </button>
                {selectedOrder.status === "Pending" && (
                  <button 
                    className="btn primary large"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "Shipped");
                      closeModal();
                    }}
                  >
                    Mark as Shipped
                  </button>
                )}
                {selectedOrder.status === "Shipped" && (
                  <button 
                    className="btn primary large"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "Delivered");
                      closeModal();
                    }}
                  >
                    Mark as Delivered
                  </button>
                )}
                <button className="btn outline" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}