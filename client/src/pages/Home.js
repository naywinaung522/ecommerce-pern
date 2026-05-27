import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data.slice(0, 4)); // Show only 4 products on home
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ကိုနေဝင်းအောင် နှင့် ညီအစ်ကိုများ - Shop</h1>
          <p>Your one-stop shop for everything</p>
          <Link to="/products" className="btn">Shop Now</Link>
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <Link to={`/product/${product.id}`} className="btn btn-secondary">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;