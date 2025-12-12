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
    if (!title.trim()) return alert('Please enter a title');

    const payload = {
      title: title.trim(),
      price: Number(price) || 0,
      image: image.trim(),
      description: description.trim(),
      category: category.trim() || 'uncategorized',
    };

    onSubmit && onSubmit(payload);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>

      <div className="form-row">
        <input
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <input
        name="image"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <input
        name="category"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button type="submit" className="btn-save">Save</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
      </div>

    </form>
  );
};

export default ProductForm;
