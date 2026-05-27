import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you would get the user's email from auth context
  // For demo, we'll use a hardcoded email or prompt user
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const searchOrders = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      // Note: You'll need to add this endpoint to your server
      const response = await axios.get(`http://localhost:5000/api/orders?email=${email}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  };

  return (
    <div className="orders-page container">
      <h1>My Orders</h1>
      
      <div className="email-search">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={searchOrders} className="btn">
          Track Orders
        </button>
      </div>

      {loading && <div className="loading">Loading orders...</div>}

      {!loading && searched && orders.length === 0 && (
        <div className="no-orders">
          <p>No orders found for this email address.</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.order_number}</h3>
                  <p className="order-date">
                    Placed on: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`order-status ${getStatusClass(order.order_status)}`}>
                  {order.order_status}
                </span>
              </div>

              <div className="order-items">
                {order.items && order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.product_name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">${item.price}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="shipping-address">
                  <strong>Shipping to:</strong> {order.shipping_address}, {order.city} {order.postal_code}
                </div>
                <div className="order-total">
                  <strong>Total:</strong> ${order.total_amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;