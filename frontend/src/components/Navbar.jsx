import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">🛍️ ShopHub</Link>
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          ☰
        </button>
        <div className={`nav-links ${open ? 'open' : ''}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          {user && (
            <Link to="/my-orders" onClick={() => setOpen(false)}>My Orders</Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
          )}
          <Link to="/cart" onClick={() => setOpen(false)}>
            Cart ({count})
          </Link>
          {user ? (
            <>
              <span className="user-name">Hi, {user.fullName}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}