import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const history = useHistory();

    const role = parseInt(localStorage.getItem('role'), 10);
    //alert(role); // Debugging line to check the role

    return (
        <div className="sidebar">
            <h2>{role === 1 ? 'Admin Panel' : role === 2 ? 'Seller Panel' : ''}</h2>
            <ul className="sidebar-links">
                {role === 1 && ( // Admin role
                    <>
                        <li onClick={() => history.push('/admin-dashboard')}>Dashboard</li>
                        <li onClick={() => history.push('/admin-users')}>Manage Users</li>
                        <li onClick={() => history.push('/admin-products')}>Manage Products</li>
                    </>
                )}
                {role === 2 && ( // Seller role
                    <>
                        <li onClick={() => history.push('/seller-dashboard')}>Dashboard</li>
                        <li onClick={() => history.push('/seller-products')}>Manage Products</li>
                        <li onClick={() => history.push('/seller-orders')}>View Orders</li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;