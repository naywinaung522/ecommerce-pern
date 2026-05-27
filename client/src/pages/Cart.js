import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty container">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" className="btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price}</p>
              </div>
              <div className="item-quantity">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn checkout-btn" 
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          
          <button className="btn btn-secondary clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
          
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;