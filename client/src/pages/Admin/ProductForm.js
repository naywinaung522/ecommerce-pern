import React, { useState, useEffect } from 'react';
import './ProductForm.css'; // Add this line

function ProductForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    stock_quantity: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        image_url: initialData.image_url || '',
        category: initialData.category || '',
        stock_quantity: initialData.stock_quantity || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: '',
        stock_quantity: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="image_url">Image URL:</label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Audio">Audio</option>
          <option value="Wearables">Wearables</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="stock_quantity">Stock Quantity:</label>
        <input
          type="number"
          id="stock_quantity"
          name="stock_quantity"
          min="0"
          value={formData.stock_quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn">
          {initialData ? 'Update Product' : 'Add Product'}
        </button>
        {onCancel && (
          <button type="button" className="btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;