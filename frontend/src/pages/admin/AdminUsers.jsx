import React, { useEffect, useState } from 'react';
import Authorization from '../../hoc/Authorization';
import Sidebar from '../../components/Sidebar';
import '../../styles/AdminUsers.css';

const AdminUsers = () => {
    // const [users, setUsers] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     // Fetch users from the backend
    //     fetch('http://localhost:5000/api/userlist', {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token
    //         },
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data.success) {
    //                 setUsers(data.users);
    //             } else {
    //                 alert('Failed to fetch users.');
    //             }
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching users:', error);
    //             setLoading(false);
    //         });
    // }, []);

    // if (loading) {
    //     return (
    //         <div className="user-list-content">
    //             <h1>User List</h1>
    //             <div className="loading-message">Loading...</div>
    //         </div>
    //     );
    // }

    const users = [
        { userID: 1, username: 'admin', email: 'admin@test.com', role: 1, createdAt: '2023-10-01T12:00:00Z' },
        { userID: 2, username: 'seller', email: 'seller@test.com', role: 2, createdAt: '2023-10-02T14:30:00Z' },
        { userID: 3, username: 'user', email: 'user@test.com', role: 3, createdAt: '2023-10-03T09:15:00Z' }
    ];

    return (
        <div className="user-list-container">
            <Sidebar />
            <div className="user-list-content">
                <h1>User List</h1>
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userID}>
                                <td>{user.userID}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{
                                    user.role === 1 ? 'Admin' : 
                                    user.role === 2 ? 'Seller' : 
                                    user.role === 3 ? 'User' : 
                                    'uncknown'
                                }</td>
                                <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default  Authorization(AdminUsers, [1]); // Only allow role 1 (admin)