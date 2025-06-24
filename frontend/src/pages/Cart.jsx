import React from 'react';
import { useCart } from '../context/CartContext';
import { useHistory, Link } from 'react-router-dom'; 
import defaultImage from '../assets/default.jpg'; // Import the default image
import '../styles/Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const history = useHistory(); // Add this line

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cart.length === 0) return (<div className="cart-container"><div>Your cart is empty.</div></div>);

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price (MYR)</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map(item => (
                        <tr key={item.productID}>
                            <td>
                                <img
                                    src={item.imageURL || defaultImage} // Use default image if imageURL is empty
                                    alt={item.name}
                                    className="product-image"
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = defaultImage; // Set default image if the image is broken
                                    }}
                                />
                                <Link to={"/product/"+ item.productID}>{item.name}</Link>
                            </td>
                            <td>{(item.price / 100).toFixed(2)}</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => updateQuantity(item.productID, parseInt(e.target.value))}
                                    style={{ width: '60px' }}
                                />
                            </td>
                            <td>{((item.price * item.quantity) / 100).toFixed(2)}</td>
                            <td>
                                <button onClick={() => removeFromCart(item.productID)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Total: MYR {(total / 100).toFixed(2)}</h2>
            <button className="clearcart-btn" onClick={clearCart}>Clear Cart</button>
            <button
                className="checkout-btn"
                onClick={() => history.push('/checkout')}
            >
                Proceed to Checkout
            </button>
        </div>
    );
};

export default Cart;