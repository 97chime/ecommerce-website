import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const MyOrder = () => {
    //const [orders, setOrders] = useState([]);
    //const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/my-orders', {
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.success) setOrders(data.orders);
    //             setLoading(false);
    //         });
    // }, []);

    //if (loading) return <div>Loading...</div>;

    const orders = [
        { orderID: '5', createdAt: '2023-10-01T12:00:00Z', totalAmount: 5000, status: 1 },
        { orderID: '7', createdAt: '2023-10-02T14:30:00Z', totalAmount: 7500, status: 2 },
        { orderID: '9', createdAt: '2023-10-03T16:45:00Z', totalAmount: 3000, status: 3 },
    ];

    return (
        <div className="myorder-container">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                <table >
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total (MYR)</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderID}>
                                <td>{order.orderID}</td>
                                <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</td>
                                <td>{(order.totalAmount / 100).toFixed(2)}</td>
                                <td>{statusMap[order.status] || order.status}</td>
                                <td>
                                    <Link to={`/myorders/${order.orderID}`}>
                                        <button className="view-details-btn">View Details</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyOrder;