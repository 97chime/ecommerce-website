import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            history.push('/'); // Redirect to home if already logged in
        }
    }, [history]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Example: Send login data to the backend
        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    //alert(data.token);

                    const payload = JSON.parse(atob(data.token.split('.')[1]));
                    const id = payload.id;
                    const role = payload.role;

                    //alert(JSON.stringify(payload)); 
                    //alert(`Login successful! User ID: ${id}, Role: ${role}`);

                    // Store the token & role in localStorage or state
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('id', id);
                    localStorage.setItem('role', role);
                    
                    if (role === 1) { // admin
                        window.location.href = '/admin-dashboard';
                    } else if (role === 2) { // seller
                        // Redirect to seller dashboard
                        window.location.href = '/seller-dashboard';
                    } else if (role === 3) { // customer
                        // Redirect to customer homepage
                        window.location.href = '/';
                    }
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            })
            .catch((error) => console.error('Error during login:', error));
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;