import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} item(s) added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
        ← Back
      </button>
      
      <div className="product-detail-content">
        <div className="product-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="category">Category: {product.category}</p>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          <p className="stock">
            {product.stock_quantity > 0 ? `In Stock: ${product.stock_quantity}` : 'Out of Stock'}
          </p>
          
          {product.stock_quantity > 0 && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock_quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
              
              <div className="action-buttons">
                <button onClick={handleAddToCart} className="btn add-to-cart-btn">
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn buy-now-btn">
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;