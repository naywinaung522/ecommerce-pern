import React, { useState } from 'react';
import './OrderList.css';

function OrderList({ orders, onUpdateStatus }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#28a745';
      case 'delivered': return '#007bff';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="order-list">
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
              <div className="order-info">
                <span className="order-number">Order #{order.order_number}</span>
                <span className="order-date">{formatDate(order.created_at)}</span>
              </div>
              <div className="order-status">
                <select 
                  value={order.order_status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  style={{ backgroundColor: getStatusColor(order.order_status), color: 'white' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="order-details">
                <div className="customer-info">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {order.customer_name}</p>
                  <p><strong>Email:</strong> {order.customer_email}</p>
                  <p><strong>Phone:</strong> {order.customer_phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {order.shipping_address}, {order.city} {order.postal_code}</p>
                </div>

                <div className="order-items">
                  <h4>Order Items</h4>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items && order.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price}</td>
                          <td>${item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                        <td><strong>${order.total_amount}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="order-payment">
                  <p><strong>Payment Method:</strong> {order.payment_method || 'Not specified'}</p>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OrderList;