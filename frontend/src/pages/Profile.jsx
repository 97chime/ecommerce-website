import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ username: '', email: '' });
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        recipientName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: '',
        isDefault: 0
    });
    const [editAddressId, setEditAddressId] = useState(null);
    const [editAddressData, setEditAddressData] = useState({
        recipientName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: '',
        isDefault: 0
    });


    useEffect(() => {
        fetch('http://localhost:5000/api/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUser(data.user);
                    setAddresses(data.addresses);
                } else {
                    alert('Failed to fetch profile.');
                }
                setLoading(false);
            })
            .catch(() => {
                alert('Failed to fetch profile.');
                setLoading(false);
            });
    }, []);

    const handleEditClick = () => {
        setEditData({ username: user.username, email: user.email });
        setEditMode(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/api/profile/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(editData),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUser(prev => ({ ...prev, ...editData }));
                    setEditMode(false);
                } else {
                    alert('Failed to update profile.');
                }
            })
            .catch(() => alert('Failed to update profile.'));
    };

    const handleAddAddressChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleAddAddressSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/api/address/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newAddress),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAddresses(prev => [
                        ...prev,
                        { ...newAddress, addressID: data.addressID }
                    ]);
                    setShowAddAddress(false);
                    setNewAddress({
                        recipientName: '',
                        addressLine1: '',
                        addressLine2: '',
                        city: '',
                        postalCode: '',
                        country: '',
                        isDefault: 0
                    });
                } else {
                    alert('Failed to add address.');
                }
            })
            .catch(() => alert('Failed to add address.'));
    };

    const handleEditAddressClick = (address) => {
        setEditAddressId(address.addressID);
        setEditAddressData({
            recipientName: address.recipientName,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || '',
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault
        });
    };
    
    const handleEditAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditAddressData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleEditAddressSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/api/address/edit/${editAddressId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(editAddressData),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAddresses(prev =>
                        prev.map(addr =>
                            addr.addressID === editAddressId
                                ? { ...addr, ...editAddressData }
                                : addr
                        )
                    );
                    setEditAddressId(null);
                } else {
                    alert('Failed to update address.');
                }
            })
            .catch(() => alert('Failed to update address.'));
    };

    if (loading) return <div className="profile-container">Loading...</div>;

    return (
        <div className="profile-container">
            <section className="profile-section">
                <div className="section-header">
                    <div className="header-container">
                        <h2>Basic Information</h2>
                    </div>
                    <div className="addeditbtn-container">
                        {!editMode && (
                            <button className="edit-btn" onClick={handleEditClick}>Edit</button>
                        )}
                    </div>
                </div>
                <div className="profile-info">
                    {editMode ? (
                        <form onSubmit={handleEditSubmit} className="edit-profile-form">
                            <div>
                                <strong>Username:</strong>
                                <input
                                    type="text"
                                    name="username"
                                    value={editData.username}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div>
                                <strong>Email:</strong>
                                <input
                                    type="email"
                                    name="email"
                                    value={editData.email}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <div><strong>Username:</strong> {user.username}</div>
                            <div><strong>Email:</strong> {user.email}</div>
                            <div>
                                <strong>Password:</strong>
                                <Link to="/change-password" style={{ marginLeft: '10px' }}>Edit</Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Only show address section if user is customer (role === 3) */}
            {user && user.role === 3 && (
                <section className="profile-section">
                    <div className="section-header">
                        <div className="header-container">
                            <h2>Addresses</h2>
                        </div>
                        <div className="addeditbtn-container">
                            <button className="add-btn" onClick={() => setShowAddAddress(!showAddAddress)}>
                                {showAddAddress ? 'Cancel' : 'Add Address'}
                            </button>
                        </div>
                    </div>
                    {showAddAddress && (
                        <form className="address-form" onSubmit={handleAddAddressSubmit} style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                name="recipientName"
                                placeholder="Recipient Name"
                                value={newAddress.recipientName}
                                onChange={handleAddAddressChange}
                                required
                            />
                            <input
                                type="text"
                                name="addressLine1"
                                placeholder="Address Line 1"
                                value={newAddress.addressLine1}
                                onChange={handleAddAddressChange}
                                required
                            />
                            <input
                                type="text"
                                name="addressLine2"
                                placeholder="Address Line 2"
                                value={newAddress.addressLine2}
                                onChange={handleAddAddressChange}
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={newAddress.city}
                                onChange={handleAddAddressChange}
                                required
                            />
                            <input
                                type="text"
                                name="postalCode"
                                placeholder="Postal Code"
                                value={newAddress.postalCode}
                                onChange={handleAddAddressChange}
                                required
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={newAddress.country}
                                onChange={handleAddAddressChange}
                                required
                            />
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={!!newAddress.isDefault}
                                    onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked ? 1 : 0 })}
                                />
                                {' '}Set as default address
                            </label>
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={() => setShowAddAddress(false)}>Cancel</button>
                        </form>
                    )}
                    <div className="address-list">
                        {addresses.length === 0 && <div>No addresses found.</div>}
                        {addresses.map(addr => (
                            <div className="address-card" key={addr.addressID}>
                                {editAddressId === addr.addressID ? (
                                    <form onSubmit={handleEditAddressSubmit} className="address-form">
                                        <input
                                            type="text"
                                            name="recipientName"
                                            placeholder="Recipient Name"
                                            value={editAddressData.recipientName}
                                            onChange={handleEditAddressChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="addressLine1"
                                            placeholder="Address Line 1"
                                            value={editAddressData.addressLine1}
                                            onChange={handleEditAddressChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            placeholder="Address Line 2"
                                            value={editAddressData.addressLine2}
                                            onChange={handleEditAddressChange}
                                        />
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={editAddressData.city}
                                            onChange={handleEditAddressChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="postalCode"
                                            placeholder="Postal Code"
                                            value={editAddressData.postalCode}
                                            onChange={handleEditAddressChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="country"
                                            placeholder="Country"
                                            value={editAddressData.country}
                                            onChange={handleEditAddressChange}
                                            required
                                        />
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="isDefault"
                                                checked={!!editAddressData.isDefault}
                                                onChange={handleEditAddressChange}
                                            />
                                            {' '}Set as default address
                                        </label>
                                        <button type="submit" className="save-btn">Save</button>
                                        <button type="button" className="cancel-btn" onClick={() => setEditAddressId(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <div><strong>Recipient:</strong> {addr.recipientName}</div>
                                        <div>{addr.addressLine1}</div>
                                        {addr.addressLine2 && <div>{addr.addressLine2}</div>}
                                        <div>{addr.city}, {addr.postalCode}, {addr.country}</div>
                                        <div><b>{addr.isDefault === 1 ? "Default Address" : ""}</b></div>
                                        <button className="edit-btn" onClick={() => handleEditAddressClick(addr)}>Edit</button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Profile;