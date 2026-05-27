-- Create database
CREATE DATABASE ecommerce_db;

-- Connect to database
\c ecommerce_db;

-- Create admin users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123 - you should hash this in production)
INSERT INTO admin_users (username, password, email) VALUES
('admin', 'admin123', 'admin@eshop.com');

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Smartphone X', 'Latest smartphone with amazing features', 699.99, 'https://via.placeholder.com/300x200?text=Smartphone', 'Electronics', 50),
('Laptop Pro', 'High-performance laptop for professionals', 1299.99, 'https://via.placeholder.com/300x200?text=Laptop', 'Electronics', 30),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 'https://via.placeholder.com/300x200?text=Headphones', 'Audio', 100),
('Smart Watch', 'Fitness tracking smartwatch', 249.99, 'https://via.placeholder.com/300x200?text=Watch', 'Wearables', 75);