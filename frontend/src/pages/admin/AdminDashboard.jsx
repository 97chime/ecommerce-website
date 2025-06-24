import React from 'react';
import { useHistory } from 'react-router-dom';
import Authorization from '../../hoc/Authorization';
import Sidebar from '../../components/Sidebar';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
    const history = useHistory();

    return (
        <div className="admin-dashboard-container">
            <Sidebar />
            <div className="admin-dashboard-content">
                <h1>Admin Dashboard</h1>
                <div className="dashboard-sections">
                    <div className="section">
                        <h2>Manage Users</h2>
                        <p>View user accounts</p>
                        <button onClick={() => history.push('/admin-users')}>Go</button>
                    </div>
                    <div className="section">
                        <h2>Manage Products</h2>
                        <p>Review or remove products from the store.</p>
                        <button onClick={() => history.push('/admin-products')}>Go</button>
                    </div>
                    {/* <div className="section">
                        <h2>View Orders</h2>
                        <p>Review current or past orders.</p>
                        <button onClick={() => history.push('/admin-orders')}>Go</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default  Authorization(AdminDashboard, [1]); // Only allow role 1 (admin)