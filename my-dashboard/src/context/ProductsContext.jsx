import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProducts, refreshProductsCache } from '../service/api';

const ProductsContext = createContext();
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const fetchProducts = useCallback(async (force = false) => {
    if (!force && initialized) return;
    
    setLoading(true);
    try {
      const data = await getProducts(force);
      setProducts(data || []);
      setInitialized(true);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  const refreshProducts = useCallback(async () => {
    await refreshProductsCache();
    await fetchProducts(true);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = {
    products,
    loading,
    refreshProducts,
    initialized
  };
  
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);