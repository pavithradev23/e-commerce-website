const API = 'https://fakestoreapi.com/products';
const CACHE_KEY = 'products_cache';
const CACHE_TIMESTAMP_KEY = 'products_cache_timestamp';
const CACHE_DURATION = 30 * 60 * 1000;

const isCacheValid = () => {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  if (!timestamp) return false;
  
  const now = Date.now();
  const cacheAge = now - parseInt(timestamp, 10);
  return cacheAge < CACHE_DURATION;
};

const getFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    return null;
  }
};

const saveToCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
  }
};

const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
};

export const getProducts = async (forceRefresh = false) => {
  if (!forceRefresh && isCacheValid()) {
    const cachedData = getFromCache();
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    const response = await fetch(API);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    saveToCache(data);
    
    return data;
  } catch (error) {
    const cachedData = getFromCache();
    if (cachedData) {
      return cachedData;
    }
    
    throw error;
  }
};

export const refreshProductsCache = async () => {
  clearCache();
  return getProducts(true);
};

export const getProductById = async (id) => {
  const res = await fetch(`${API}/${id}`);
  return res.json();
};

export const createProduct = async (data) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  clearCache();
  
  return res.json();
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  clearCache();
  
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  
  clearCache();
  
  return res.json();
};