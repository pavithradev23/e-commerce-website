import React, { useEffect, useState } from 'react';

const ProductForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [image, setImage] = useState(initialData.image || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [stock, setStock] = useState(initialData.stock || '10');
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    setTitle(initialData.title || '');
    setPrice(initialData.price || '');
    setImage(initialData.image || '');
    setDescription(initialData.description || '');
    setCategory(initialData.category || '');
    setStock(initialData.stock || '10');
    
    if (initialData.image && initialData.image.startsWith('data:image')) {
      setImagePreview(initialData.image);
    }
  }, [initialData]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    let finalImage = image;
    
    if (useImageUpload && imageFile) {
      try {
        finalImage = await imageToBase64(imageFile);
      } catch (error) {
        console.error('Error converting image:', error);
        alert('Failed to process image');
        return;
      }
    }
    
    const payload = {
      title,
      price: Number(price),
      image: finalImage,
      description,
      category,
      stock: Number(stock)
    };
    onSubmit(payload);
  };

  return (
    <div className="product-form-modal">
      <form className="product-form" onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: 20, color: '#333' }}>
          {initialData.id ? 'Edit Product' : 'Add New Product'}
        </h3>

        <div className="form-group">
          <label>Product Title *</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter product title" 
            required
            style={{ 
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              marginTop: '5px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Price ($) *</label>
            <input 
              value={price} 
              type="number" 
              step="0.01"
              min="0"
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="0.00" 
              required
              style={{ 
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                marginTop: '5px'
              }}
            />
          </div>
          
          <div className="form-group" style={{ flex: 1 }}>
            <label>Stock *</label>
            <input 
              value={stock} 
              type="number" 
              min="0"
              onChange={(e) => setStock(e.target.value)} 
              placeholder="Quantity" 
              required
              style={{ 
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                marginTop: '5px'
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{ 
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              marginTop: '5px',
              background: 'white'
            }}
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Kitchen</option>
            <option value="beauty">Beauty</option>
            <option value="sports">Sports</option>
          </select>
        </div>

        <div className="form-group">
          <label>Product Image *</label>
          
     
          <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={() => setUseImageUpload(false)}
              style={{
                padding: '8px 16px',
                background: !useImageUpload ? '#4a6cf7' : '#f0f0f0',
                color: !useImageUpload ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Use Image URL
            </button>
            <button 
              type="button"
              onClick={() => setUseImageUpload(true)}
              style={{
                padding: '8px 16px',
                background: useImageUpload ? '#4a6cf7' : '#f0f0f0',
                color: useImageUpload ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Upload from Device
            </button>
          </div>

          {useImageUpload ? (
            <div>
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required={useImageUpload}
                style={{ 
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginTop: '5px'
                }}
              />
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <p>Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }} 
                  />
                </div>
              )}
            </div>
          ) : (
      
            <input 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
              placeholder="https://example.com/image.jpg" 
              required={!useImageUpload}
              style={{ 
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                marginTop: '5px'
              }}
            />
          )}
        </div>

        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Enter product description..."
            rows="3"
            style={{ 
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              marginTop: '5px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginTop: 25, display: "flex", gap: 12 }}>
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #ff7a18, #ff3d00)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(255, 61, 0, 0.3)",
              flex: 1
            }}
          >
            {initialData.id ? 'Update Product' : 'Add Product'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "12px 24px",
              background: "#f5f5f5",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              flex: 1
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        .product-form-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .product-form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #444;
        }
        
        @media (max-width: 600px) {
          .product-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductForm;