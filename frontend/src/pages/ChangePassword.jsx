import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ChangePassword = () => {const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }
        setLoading(true);
        fetch('http://localhost:5000/api/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(passwordData),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Password updated successfully.');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(data.message || 'Failed to update password.');
            }
            setLoading(false);
        })
        .catch(() => {
            alert('Failed to update password.');
            setLoading(false);
        });
    };

    return (
        <div className="profile-container">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="edit-password-form">
                <div>
                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        style={{ marginRight: '8px' }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        style={{ marginRight: '8px' }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        style={{ marginRight: '8px' }}
                    />
                </div>
                <button type="submit" className="save-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={ () => {history.goBack()}} className="cancel-btn">
                    Back
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;