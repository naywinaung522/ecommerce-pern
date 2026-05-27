import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || 'N/A';

  return (
    <div className="confirmation-page container">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h1>Thank You for Your Order!</h1>
        <p className="order-number">
          Order Number: <strong>{orderNumber}</strong>
        </p>
        <p className="confirmation-message">
          We have received your order and will process it shortly.
          You will receive an email confirmation with your order details.
        </p>
        
        <div className="confirmation-actions">
          <Link to="/products" className="btn">
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-secondary">
            Track Your Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;