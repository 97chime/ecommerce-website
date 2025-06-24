import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Authorization = (WrappedComponent, allowedRoles) => {
    return (props) => {
        const history = useHistory();

        useEffect(() => {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Access denied. Please log in.');
                history.push('/login');
                return;
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role;

                if (!allowedRoles.includes(role)) {
                    alert('Access denied. You do not have permission to view this page.');
                    history.goBack(); // Go back to the previous page
                }
            } catch (error) {
                console.error('Invalid token:', error);
                alert('Invalid session. Please log in again.');
                history.push('/login');
            }
        }, [history]);

        return <WrappedComponent {...props} />;
    };
};

export default Authorization;