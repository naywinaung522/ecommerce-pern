import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="products-page container">
      <h1>Our Products</h1>
      
      <div className="filters">
        <label htmlFor="category">Filter by category:</label>
        <select 
          id="category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="description">{product.description.substring(0, 100)}...</p>
            <p className="price">${product.price}</p>
            <p className="stock">In Stock: {product.stock_quantity}</p>
            <Link to={`/product/${product.id}`} className="btn btn-secondary">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;