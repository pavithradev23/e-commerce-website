import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart, placeOrder } = useShop();

  const [showSuccess, setShowSuccess] = useState(false);

  const total = cart.reduce(
    (sum, p) => sum + (p.price || 0) * (p.qty || 1),
    0
  );

  
  const handleCheckout = () => {
  if (cart.length === 0) return;

  
  const newOrder = placeOrder(cart, total);
  setShowSuccess(true);

  setTimeout(() => {
    clearCart();
    navigate("/orders", { state: { orderId: newOrder.id } });
  }, 1200);
};

  
  if (cart.length === 0) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          background: "#ffffff",
          minHeight: "100vh",
        }}
      >
        <h2>Your cart is empty</h2>

        <button
          onClick={() => navigate("/reports")}
          style={{
            marginTop: 15,
            padding: "12px 20px",
            background: "#000",
            color: "#fff",
            borderRadius: 8,
            cursor: "pointer",
            border: "none",
          }}
        >
          Go Shopping
        </button>
      </div>
    );
  }

  
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          padding: "40px 0",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: 1200,
            background: "#fff",
            margin: "0 auto",
            padding: 30,
            borderRadius: 20,
            boxShadow: "0 10px 35px rgba(0,0,0,0.07)",
            display: "flex",
            gap: 30,
          }}
        >
          
          <div style={{ flex: 2 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700 }}>Cart</h1>

            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  padding: "18px 0",
                  borderBottom: "1px solid #eee",
                  gap: 20,
                  alignItems: "center",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: "contain",
                    borderRadius: 12,
                    background: "#fafafa",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{item.title}</h3>

                  <div style={{ marginTop: 6, fontSize: 14, color: "#555" }}>
                    ${item.price.toFixed(2)}
                  </div>

              
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <button
                      onClick={() => decreaseQty(item.id)}
                      style={qtyBtn}
                    >
                      −
                    </button>

                    <span style={{ minWidth: 20, textAlign: "center" }}>
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      style={qtyBtn}
                    >
                      +
                    </button>
                  </div>
                </div>

     
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 20,
                    color: "#d33",
                  }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>

          
          <div
            style={{
              flex: 1,
              background: "#fff",
              padding: 20,
              borderRadius: 16,
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              height: "fit-content",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>Order Summary</h2>

            <div style={summaryRow}>
              <span>Subtotal</span>
              <b>${total.toFixed(2)}</b>
            </div>

            <div style={summaryRow}>
              <span>Shipping</span>
              <b style={{ color: "#ff4d00" }}>Free</b>
            </div>

            <div style={summaryRow}>
              <span>Tax</span>
              <b>$0.00</b>
            </div>

            <hr style={{ margin: "18px 0", borderColor: "#eee" }} />

            <div style={summaryRow}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
              <b style={{ fontSize: 18 }}>${total.toFixed(2)}</b>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "12px 0",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: 30,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

    
      {showSuccess && (
        <div style={popupOverlay}>
          <div style={popupBox}>
            <div style={tickCircle}>✓</div>
            <h2 style={{ marginTop: 10 }}>Order Confirmed!</h2>
            <p>Your order has been placed successfully 🎉</p>

            <button
  onClick={() => {
    setShowSuccess(false);
    navigate("/store"); // ✅ correct route
  }}
  style={{
    marginTop: 15,
    padding: "10px 20px",
    background: "#000",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    border: "none",
  }}
>
  Go Shopping
</button>

          </div>
        </div>
      )}
    </>
  );
}


const qtyBtn = {
  width: 30,
  height: 30,
  borderRadius: 6,
  border: "1px solid #aaa",
  cursor: "pointer",
  background: "#fff",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
  fontSize: 15,
};

const popupOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const popupBox = {
  background: "#fff",
  padding: "30px 40px",
  borderRadius: 14,
  textAlign: "center",
  width: 320,
  animation: "popupFade 0.3s ease",
};

const tickCircle = {
  width: 70,
  height: 70,
  borderRadius: "50%",
  background: "#4CAF50",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 34,
  margin: "0 auto",
  animation: "pop 0.4s ease",
};

