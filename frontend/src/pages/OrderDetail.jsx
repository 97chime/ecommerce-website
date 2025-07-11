import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import defaultImage from '../assets/default.jpg'; // Import the default image
import "../styles/MyOrder.css";

const statusMap = {
    1: 'Pending',
    2: 'Processing',
    3: 'Awaiting Payment',
    4: 'Shipped',
    5: 'Completed',
    6: 'Declined',
    7: 'Refunded'
};

const OrderDetail = () => {
    // const { orderID } = useParams();
    // const [order, setOrder] = useState(null);
    // const [items, setItems] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetch(`http://localhost:5000/api/my-orders/${orderID}`, {
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.success) {
    //                 setOrder(data.order);
    //                 setItems(data.items);
    //             }
    //             setLoading(false);
    //         });
    // }, [orderID]);

    // if (loading) return <div>Loading...</div>;
    // if (!order) return <div>Order not found.</div>;

    const orderID = '5'; // Hardcoded for demonstration
    const order = { orderID: '5', createdAt: '2023-10-01T12:00:00Z', totalAmount: 5000, status: 1, recipientName: 'John Doe', addressLine1: '123 Main St', addressLine2: '', city: 'Kuala Lumpur', postalCode: '50000', country: 'Malaysia' }; // Hardcoded for demonstration
    const items = [{
        orderItemID: '1',
        productID: '1',
        name: 'Sample Product 1',
        quantity: 2,
        price: 2500, // Price in cents
        imageURL: 'https://live.staticflickr.com/65535/54647467055_93e6735f48_b.jpg', 
    }, {
        orderItemID: '2',
        productID: '2',
        name: 'Sample Product 2',
        quantity: 1,
        price: 3000, // Price in cents
        imageURL: 'https://live.staticflickr.com/65535/54646303777_ca7beb095c_b.jpg',
    }];

    return (
        <div className="myorder-detail-container">
            <h2>Order #{order.orderID} Details</h2>
            <div style={{ marginBottom: 24 }}>
                <b>Status:</b> {statusMap[order.status] || order.status} <br />
                <b>Date:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'} <br />
                <b>Total:</b> MYR {(order.totalAmount / 100).toFixed(2)}
            </div>
            <div style={{ marginBottom: 24 }}>
                <h3>Shipping Address</h3>
                <div>
                    {order.recipientName}<br />
                    {order.addressLine1}{order.addressLine2 && (', ' + order.addressLine2)}<br />
                    {order.city}, {order.postalCode}, {order.country}
                </div>
            </div>
            <div>
                <h3>Products</h3>
                <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price (MYR)</th>
                            <th>Subtotal (MYR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.orderItemID}>
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
                                <td>{item.quantity}</td>
                                <td>{(item.price / 100).toFixed(2)}</td>
                                <td>{((item.price * item.quantity) / 100).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Link to="/myorders" className="back-btn">Back to My Orders</Link>
        </div>
    );
};

export default OrderDetail;