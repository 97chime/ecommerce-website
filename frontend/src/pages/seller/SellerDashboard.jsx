import React from 'react';
import { useHistory } from 'react-router-dom';
import Authorization from '../../hoc/Authorization';
import Sidebar from '../../components/Sidebar';
import '../../styles/Dashboard.css';

const SellerDashboard = () => {
    const history = useHistory();

    return (
        <div className="seller-dashboard-container">
            <Sidebar />
            <div className="seller-dashboard-content">
                <h1>Seller Dashboard</h1>
                <div className="dashboard-sections">
                    <div className="section">
                        <h2>Manage Products</h2>
                        <p>Add, edit, or remove products from your store.</p>
                        <button onClick={() => history.push('/seller-products')}>Go</button>
                    </div>
                    <div className="section">
                        <h2>Manage Orders</h2>
                        <p>View and manage customer orders.</p>
                        <button onClick={() => history.push('/seller-orders')}>Go</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Authorization(SellerDashboard, [2]); // Only allow role 2 (seller)