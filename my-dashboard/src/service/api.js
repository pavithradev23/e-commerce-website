const API = 'https://fakestoreapi.com/products';

export const getProducts = async () => {
  const res = await fetch(API);
  return res.json();
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
  return res.json();
};

export const updateProduct = async (id, data) => {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  return res.json();
};

