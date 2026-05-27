import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import OrderList from './OrderList';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/products', productData);
      setProducts([...products, response.data]);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, productData);
      setProducts(products.map(p => p.id === id ? response.data : p));
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, { status });
      fetchOrders(); // Refresh orders
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user">
          <span>Welcome, {admin?.username}</span>
          <button onClick={handleLogout} className="btn btn-secondary logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && (
          <>
            <div className="admin-section">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <ProductForm
                onSubmit={editingProduct ? 
                  (data) => handleUpdateProduct(editingProduct.id, data) : 
                  handleAddProduct
                }
                initialData={editingProduct}
                onCancel={editingProduct ? () => setEditingProduct(null) : null}
              />
            </div>

            <div className="admin-section">
              <h2>Product List</h2>
              {loading ? (
                <p>Loading products...</p>
              ) : (
                <ProductList
                  products={products}
                  onEdit={setEditingProduct}
                  onDelete={handleDeleteProduct}
                />
              )}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section">
            <h2>Order Management</h2>
            <OrderList 
              orders={orders} 
              onUpdateStatus={handleUpdateOrderStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;