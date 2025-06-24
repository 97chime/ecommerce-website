import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Header.css';

const Header = () => {
    const history = useHistory();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role')) || null; // Get role from localStorage, default to null if not set
    const { cart } = useCart();

    const handleLogout = () => {
        fetch('http://localhost:5000/api/logout', { method: 'POST' })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('id');
                    localStorage.removeItem('role');
                    setToken(null);
                    history.push('/login');
                } else {
                    alert('Logout failed. Please try again.');
                }
            })
            .catch((error) => console.error('Error during logout:', error));
    };

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setRole(localStorage.getItem('role') ? parseInt(localStorage.getItem('role')) : null);
    }, []);

    // Calculate total quantity in cart 
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="header">
            <div className="logo">E-Commerce</div>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    {
                        token ? (
                            <>
                                {role === 1 && (
                                    <li>
                                        <Link to="/admin-dashboard">Admin Dashboard</Link>
                                    </li>
                                )}
                                {role === 2 && (
                                    <>
                                        <li>
                                            <Link to="/seller-dashboard">Seller Dashboard</Link>
                                        </li>
                                    </>
                                )}
                                {role === 3 && (
                                    <>
                                        <li>
                                            <Link to="/cart" className="cart-link">
                                                Cart
                                                {cartCount > 0 && (
                                                    <span className="cart-badge">{cartCount}</span>
                                                )}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/myorders">My Orders</Link>
                                        </li>
                                    </>
                                )}
                                <li>
                                    <Link to="/profile">Profile</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="logout-button">Logout</button>
                                </li>
                            </>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )
                    }
                </ul>
            </nav>
        </header>
    );
};

export default Header;