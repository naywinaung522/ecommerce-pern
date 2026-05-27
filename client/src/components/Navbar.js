import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
           ကိုနေဝင်းအောင် နှင့် ညီအစ်ကိုများ - Shop
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link">Products</Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-link cart-link">
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/orders" className="nav-link">My Orders</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;