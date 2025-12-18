import React, { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export default function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    setOrders((prev) => [
      {
        id: `ORD-${Date.now()}`,
        status: "Pending",
        createdAt: new Date().toISOString(),
        ...order,
      },
      ...prev,
    ]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status } : o
      )
    );
  };
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  return (
    <OrderContext.Provider
      value={{ 
        orders, 
        addOrder, 
        updateOrderStatus,
        deleteOrder  
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}