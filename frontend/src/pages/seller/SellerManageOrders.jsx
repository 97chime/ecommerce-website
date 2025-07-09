import React, { useEffect, useState } from 'react';
import Authorization from '../../hoc/Authorization';
import Sidebar from '../../components/Sidebar';
import '../../styles/SellerManageOrders.css'; 

const statusMap = {
    1: 'Pending',
    2: 'Processing',
    3: 'Awaiting Payment',
    4: 'Shipped',
    5: 'Completed',
    6: 'Declined',
    7: 'Refunded'
};

const statusOptions = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Processing' },
    { value: 3, label: 'Awaiting Payment' },
    { value: 4, label: 'Shipped' },
    { value: 5, label: 'Completed' },
    { value: 6, label: 'Declined' },
    { value: 7, label: 'Refunded' }
];

const SellerManageOrders = () => {
    // const [orderItems, setOrderItems] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [updatingOrder, setUpdatingOrder] = useState(null);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/seller-orders', {
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.success) setOrderItems(data.orderItems);
    //             setLoading(false);
    //         });
    // }, [updatingOrder]); // refetch when updatingOrder changes

    //if (loading) return <div>Loading...</div>;

    const orderItems = [
        { orderItemID: 1, orderID: 101, productName: 'Product A', imageURL: 'https://example.com/imageA.jpg', quantity: 2, price: 1500, orderDate: '2023-10-01T12:00:00Z', orderStatus: 1, customerName: 'John Doe' },
        { orderItemID: 2, orderID: 101, productName: 'Product B', imageURL: 'https://example.com/imageB.jpg', quantity: 1, price: 2500, orderDate: '2023-10-01T12:00:00Z', orderStatus: 1, customerName: 'John Doe' },
        { orderItemID: 3, orderID: 102, productName: 'Product C', imageURL: 'https://example.com/imageC.jpg', quantity: 3, price: 3000, orderDate: '2023-10-02T14:30:00Z', orderStatus: 2, customerName: 'Jane Smith' },
        { orderItemID: 4, orderID: 103, productName: 'Product D', imageURL: 'https://example.com/imageD.jpg', quantity: 1, price: 2000, orderDate: '2023-10-03T09:15:00Z', orderStatus: 4, customerName: 'Alice Johnson' }
    ];

    // Group orderItems by orderID
    const groupedOrders = orderItems.reduce((acc, item) => {
        if (!acc[item.orderID]) acc[item.orderID] = [];
        acc[item.orderID].push(item);
        return acc;
    }, {});

    // Sort orderIDs in descending order
    const sortedOrderIDs = Object.keys(groupedOrders)
        .map(Number)
        .sort((a, b) => b - a);

    // Handle status change
    const handleStatusChange = async (orderID, newStatus) => {
        // setUpdatingOrder(orderID);
        // try {
        //     const res = await fetch(`http://localhost:5000/api/order/${orderID}/status`, {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //         },
        //         body: JSON.stringify({ status: newStatus }),
        //     });
        //     const data = await res.json();
        //     if (!data.success) {
        //         alert(data.message || 'Failed to update status');
        //     }
        // } catch (err) {
        //     alert('Failed to update status');
        // }
        // setUpdatingOrder(null);
    };

    return (
        <div className="seller-orders-container">
            <Sidebar />
            <div className="seller-orders-content">
                <h2>Manage Orders</h2>
                {orderItems.length === 0 ? (
                    <div>No orders for your products yet.</div>
                ) : (
                    sortedOrderIDs.map(orderID => {
                        const items = groupedOrders[orderID];
                        const firstItem = items[0];
                        return (
                            <div key={orderID} className="seller-order-group">
                                <h3>
                                    Order #{orderID} | Date: {firstItem.orderDate ? new Date(firstItem.orderDate).toLocaleString() : '-'} | Status:{" "}
                                    <select
                                        value={firstItem.orderStatus}
                                        onChange={e => handleStatusChange(orderID, Number(e.target.value))}
                                        disabled={updatingOrder === orderID}
                                        style={{ marginRight: 8 }}
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    {updatingOrder === orderID && <span style={{ color: '#007bff' }}>Updating...</span>}
                                    {" "} | Customer: {firstItem.customerName}
                                </h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Image</th>
                                            <th>Quantity</th>
                                            <th>Price (MYR)</th>
                                            <th>Subtotal (MYR)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <tr key={item.orderItemID}>
                                                <td>{item.productName}</td>
                                                <td>
                                                    {item.imageURL ? (
                                                        <img src={item.imageURL} alt={item.productName} />
                                                    ) : (
                                                        <span>No Image</span>
                                                    )}
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>{(item.price / 100).toFixed(2)}</td>
                                                <td>{((item.price * item.quantity) / 100).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Authorization(SellerManageOrders, [2]); // Only allow role 2 (seller)