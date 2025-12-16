import React, { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

export default function ShopProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (p) =>
    setCart((prev) =>
      prev.find((x) => x.id === p.id)
        ? prev.map((x) =>
            x.id === p.id ? { ...x, qty: x.qty + 1 } : x
          )
        : [...prev, { ...p, qty: 1 }]
    );

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );

  const decreaseQty = (id) =>
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((x) => x.id !== id));

  const clearCart = () => setCart([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (p) =>
    setWishlist((prev) =>
      prev.some((x) => x.id === p.id)
        ? prev.filter((x) => x.id !== p.id)
        : [...prev, p]
    );
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (items, total) => {
    const statusOptions = [
      "Pending",
      "Packed",
      "Shipped",
      "Out For Delivery",
      "Delivered",
    ];

    const newOrder = {
      id: Date.now(),
      items: JSON.parse(JSON.stringify(items)),
      total,
      date: new Date().toLocaleString(),
      status:
        statusOptions[Math.floor(Math.random() * statusOptions.length)],
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const removeOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,

        wishlist,
        toggleWishlist,

    
        orders,
        placeOrder,
        removeOrder, 

        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
