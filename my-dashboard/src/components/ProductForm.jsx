import React, { useEffect, useState } from 'react';

const ProductForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [image, setImage] = useState(initialData.image || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [category, setCategory] = useState(initialData.category || '');

  useEffect(() => {
    setTitle(initialData.title || '');
    setPrice(initialData.price || '');
    setImage(initialData.image || '');
    setDescription(initialData.description || '');
    setCategory(initialData.category || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      title,
      price: Number(price),
      image,
      description,
      category
    };

    onSubmit(payload);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />

      <input value={price} type="number" onChange={(e) => setPrice(e.target.value)} placeholder="Price" />

      <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />

      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />

      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />

      <div style={{ marginTop: 10 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>Cancel</button>
      </div>

    </form>
  );
};

export default ProductForm;
