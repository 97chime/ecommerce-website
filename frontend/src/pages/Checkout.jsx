import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useHistory } from 'react-router-dom';
import '../styles/Checkout.css';

const Checkout = () => {
    const { cart } = useCart();
    const history = useHistory();
    // const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(1);
    // const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentData, setPaymentData] = useState({
        cardNumber: '5000500050005000',
        expiry: '05/05',
        cvv: '555'
    });
    const [paymentLoading, setPaymentLoading] = useState(false);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/profile', {
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.success) {
    //                 setAddresses(data.addresses);
    //                 if (data.addresses.length > 0) {
    //                     const defaultAddr = data.addresses.find(a => a.isDefault === 1);
    //                     setSelectedAddressId(defaultAddr ? defaultAddr.addressID : data.addresses[0].addressID);
    //                 }
    //             }
    //             setLoading(false);
    //         });
    // }, []);

    const addresses = [
        {
            addressID: 1,
            recipientName: 'John Doe',
            addressLine1: '123 Main St',
            addressLine2: 'Apt 4B',
            city: 'Kuala Lumpur',
            postalCode: '50000',
            country: 'Malaysia',
            isDefault: 1
        },
        {
            addressID: 2,
            recipientName: 'Jane Smith',
            addressLine1: '456 Elm St',
            addressLine2: '',
            city: 'Petaling Jaya',
            postalCode: '46000',
            country: 'Malaysia',
            isDefault: 0
        }
    ];

    const handleAddressChange = (e) => {
        setSelectedAddressId(Number(e.target.value));
    };

    const handlePaymentChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        // Simple validation
        // if (
        //     !/^\d{16}$/.test(paymentData.cardNumber) ||
        //     !/^\d{2}\/\d{2}$/.test(paymentData.expiry) ||
        //     !/^\d{3,4}$/.test(paymentData.cvv)
        // ) {
        //     alert('Please enter valid payment details.');
        //     return;
        // }
        // setPaymentLoading(true);

        // try {
        //     const response = await fetch('http://localhost:5000/api/place-order', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //         },
        //         body: JSON.stringify({
        //             addressID: selectedAddressId,
        //             cart: cart.map(item => ({
        //                 productID: item.productID,
        //                 quantity: item.quantity,
        //                 price: item.price
        //             })),
        //             total,
        //             payment: paymentData
        //         }),
        //     });
        //     const data = await response.json();
        //     setPaymentLoading(false);
        //     if (data.success) {
        //         // Clear cart after successful order
        //         localStorage.removeItem('cart');
        //         window.dispatchEvent(new Event('storage')); // Trigger cart update in CartContext
        //         alert('Payment successful! Order placed.');
        //         setShowPayment(false);
        //         history.push('/myorders/'+data.orderID); // Redirect to order details
        //     } else {
        //         alert(data.message || 'Failed to place order.');
        //     }
        // } catch (err) {
        //     setPaymentLoading(false);
        //     alert('Failed to place order. Please try again.');
        // }
    };

    //if (loading) return <div className="checkout-container">Loading...</div>;

    return (
        <div className="checkout-container flex-checkout">
            <div className="checkout-main">
                <h2>Shipping Address</h2>
                {addresses.length === 0 ? (
                    <div>No addresses found. Please add one in your profile.</div>
                ) : (
                    <form>
                        {addresses.map(addr => (
                            <div key={addr.addressID} className="checkout-address-card">
                                <label>
                                    <input
                                        type="radio"
                                        name="address"
                                        value={addr.addressID}
                                        checked={selectedAddressId === addr.addressID}
                                        onChange={handleAddressChange}
                                    />
                                    <span className="checkout-address-info">
                                        <b>{addr.recipientName}</b><br />
                                        {addr.addressLine1}{addr.addressLine2 && (', ' + addr.addressLine2)}<br />
                                        {addr.city}, {addr.postalCode}, {addr.country}
                                        {addr.isDefault === 1 && <span className="default-address">(Default)</span>}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </form>
                )}

                <h2 className="order-summary-title">Order Summary</h2>
                <table className="checkout-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Product</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(item => (
                            <tr key={item.productID}>
                                <td>{item.name}</td>
                                <td>MYR {(item.price / 100).toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>MYR {((item.price * item.quantity) / 100).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="checkout-summary">
                <h2>Total</h2>
                <div className="checkout-total">
                    MYR {(total / 100).toFixed(2)}
                </div>
                <button
                    className="checkout-btn"
                    onClick={() => {
                        if (!selectedAddressId) {
                            alert('Please select a shipping address.');
                            return;
                        }
                        setShowPayment(true);
                    }}
                    disabled={addresses.length === 0}
                >
                    Place Order
                </button>
            </div>
            {showPayment && (
                <div className="payment-modal">
                    <div className="payment-modal-content">
                        <h3>Mock Payment</h3>
                        <form onSubmit={handlePaymentSubmit}>
                            <label>Card Number (16 digits)</label>
                            <input
                                type="text"
                                name="cardNumber"
                                placeholder="Card Number (16 digits)"
                                value={paymentData.cardNumber}
                                onChange={handlePaymentChange}
                                maxLength={16}
                                required
                            />
                            <label>MM/YY</label>
                            <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                value={paymentData.expiry}
                                onChange={handlePaymentChange}
                                maxLength={5}
                                required
                            />
                            <label>CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                placeholder="CVV"
                                value={paymentData.cvv}
                                onChange={handlePaymentChange}
                                maxLength={4}
                                required
                            />
                            <button type="submit" className="checkout-btn" disabled={paymentLoading}>
                                {paymentLoading ? 'Processing...' : 'Pay Now'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => setShowPayment(false)} disabled={paymentLoading}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;