/* const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== AUTH ROUTES ====================
// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In production, use bcrypt to compare hashed passwords
    const admin = await db.query(
      'SELECT id, username, email FROM admin_users WHERE username = $1 AND password = $2',
      [username, password]
    );
    
    if (admin.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      success: true, 
      admin: admin.rows[0],
      token: 'simple-token-' + Date.now() // In production, use JWT
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== PRODUCT ROUTES ====================
// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products ORDER BY id');
    res.json(products.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image_url, category, stock_quantity } = req.body;
    
    const newProduct = await db.query(
      'INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, image_url, category, stock_quantity]
    );
    
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category, stock_quantity } = req.body;
    
    const updateProduct = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, stock_quantity = $6 WHERE id = $7 RETURNING *',
      [name, description, price, image_url, category, stock_quantity, id]
    );
    
    if (updateProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(updateProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ORDER ROUTES ====================
// Create order
app.post('/api/orders', async (req, res) => {
  const client = await db.query('BEGIN');
  
  try {
    const { customerInfo, items, totalAmount } = req.body;
    
    // Generate unique order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    // Insert order
    const orderResult = await db.query(
      `INSERT INTO orders 
       (order_number, customer_name, customer_email, customer_phone, shipping_address, city, postal_code, total_amount) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [orderNumber, customerInfo.fullName, customerInfo.email, customerInfo.phone, 
       customerInfo.address, customerInfo.city, customerInfo.zipCode, totalAmount]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Insert order items and update stock
    for (const item of items) {
      // Insert order item
      await db.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.id, item.name, item.quantity, item.price, item.price * item.quantity]
      );
      
      // Update product stock
      await db.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.id]
      );
    }
    
    await db.query('COMMIT');
    
    res.json({ 
      success: true, 
      orderNumber: orderNumber,
      message: 'Order placed successfully' 
    });
    
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get all orders (admin)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await db.query(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'product_name', oi.product_name,
               'quantity', oi.quantity,
               'price', oi.price,
               'subtotal', oi.subtotal
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(orders.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status (admin)
app.put('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db.query(
      'UPDATE orders SET order_status = $1 WHERE id = $2',
      [status, id]
    );
    
    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ==================== AUTH ROUTES ====================
// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // In production, use bcrypt to compare hashed passwords
    const admin = await db.query(
      'SELECT id, username, email FROM admin_users WHERE username = $1 AND password = $2',
      [username, password]
    );
    
    if (admin.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      success: true, 
      admin: admin.rows[0],
      token: 'simple-token-' + Date.now() // In production, use JWT
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== PRODUCT ROUTES ====================
// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products ORDER BY id');
    res.json(products.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product.rows[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image_url, category, stock_quantity } = req.body;
    
    const newProduct = await db.query(
      'INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, image_url, category, stock_quantity]
    );
    
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category, stock_quantity } = req.body;
    
    const updateProduct = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, category = $5, stock_quantity = $6 WHERE id = $7 RETURNING *',
      [name, description, price, image_url, category, stock_quantity, id]
    );
    
    if (updateProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(updateProduct.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ORDER ROUTES ====================
// Create order
app.post('/api/orders', async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { customerInfo, items, totalAmount } = req.body;
    
    // Generate unique order number
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders 
       (order_number, customer_name, customer_email, customer_phone, shipping_address, city, postal_code, total_amount) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [orderNumber, customerInfo.fullName, customerInfo.email, customerInfo.phone, 
       customerInfo.address, customerInfo.city, customerInfo.zipCode, totalAmount]
    );
    
    const orderId = orderResult.rows[0].id;
    
    // Insert order items and update stock
    for (const item of items) {
      // Insert order item
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.id, item.name, item.quantity, item.price, item.price * item.quantity]
      );
      
      // Update product stock
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.id]
      );
    }
    
    await client.query('COMMIT');
    
    res.json({ 
      success: true, 
      orderNumber: orderNumber,
      message: 'Order placed successfully' 
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    client.release();
  }
});

// Get orders by email (for customers)
app.get('/api/orders', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const orders = await db.query(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'product_name', oi.product_name,
               'quantity', oi.quantity,
               'price', oi.price,
               'subtotal', oi.subtotal
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_email = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [email]);
    
    res.json(orders.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all orders (admin)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await db.query(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'product_name', oi.product_name,
               'quantity', oi.quantity,
               'price', oi.price,
               'subtotal', oi.subtotal
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    res.json(orders.rows);
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status (admin)
app.put('/api/admin/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db.query(
      'UPDATE orders SET order_status = $1 WHERE id = $2',
      [status, id]
    );
    
    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString() 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
});