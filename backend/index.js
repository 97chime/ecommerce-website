const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// vvv for testing purposes only vvv
const SECRET_KEY = '9fc25d377fc99eaa4f6ed3b9c8b0e75e14ad0fd6b3ee3de10f4710403096e82c067d364f8b38e8c97114e70e9048d20ecd248e5845bcae7b78a6c6b1f805ba1f';

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with requests
}));

// Load environment variables from .env file
dotenv.config();

// Middleware to Verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token.' });
        }
        req.user = user; // Attach user info to the request
        next();
    });
};

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// function getCurrentDate() {
//     const date = new Date(); // Get the current date and time
//     const year = date.getFullYear(); // Get the year
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-based, so add 1) and pad with leading zero
//     const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero
//     const hours = String(date.getHours()).padStart(2, '0'); // Get the hours and pad with leading zero
//     const minutes = String(date.getMinutes()).padStart(2, '0'); // Get the minutes and pad with leading zero
//     const seconds = String(date.getSeconds()).padStart(2, '0'); // Get the seconds and pad with leading zero

//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Return the date in YYYY-MM-DD format
// }


// login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            if (isMatch) {
                // Generate a JWT
                const token = jwt.sign(
                    { id: user.userID, role: user.role },
                    SECRET_KEY,
                    { expiresIn: '1h' } // Token expires in 1 hour
                );
                //res.cookie('token', token, { httpOnly: true, secure: true }); // Set the token as a cookie
                
                // Send the token and user role back to the client
                return res.json({ 
                    success: true,
                    token: token, 
                    id: user.id, 
                    role: user.role 
                });

            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        });
    });
});

app.post('/api/logout', (req, res) => {
    //res.clearCookie('token'); // Clear the token cookie
    res.json({ success: true, message: 'Logged out successfully' });
});

// Get user profile and address by userID
app.get('/api/profile', authenticateToken, (req, res) => {
    const userID = req.user.id;

    const userQuery = 'SELECT userID, username, email, role FROM users WHERE userID = ?';
    const addressQuery = `
        SELECT addressID, recipientName, addressLine1, addressLine2, city, postalCode, country, isDefault
        FROM addresses
        WHERE userID = ?
    `;

    db.query(userQuery, [userID], (err, userResults) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (userResults.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        db.query(addressQuery, [userID], (err, addressResults) => {
            if (err) {
                console.error('Error fetching address:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            res.json({
                success: true,
                user: userResults[0],
                addresses: addressResults
            });
        });
    });
});

// Update user profile
app.put('/api/profile/edit', authenticateToken, (req, res) => {
    const userID = req.user.id;
    const { username, email } = req.body;
    const query = 'UPDATE users SET username = ?, email = ? WHERE userID = ?';
    db.query(query, [username, email, userID], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Profile updated successfully' });
    });
});

// change password
app.put('/api/change-password', authenticateToken, (req, res) => {
    const userID = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const getUserQuery = 'SELECT password FROM users WHERE userID = ?';
    db.query(getUserQuery, [userID], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

        const hashedPassword = results[0].password;
        bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
            if (err) return res.status(500).json({ success: false, message: 'Server error' });
            if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) return res.status(500).json({ success: false, message: 'Server error' });
                const updateQuery = 'UPDATE users SET password = ? WHERE userID = ?';
                db.query(updateQuery, [hash, userID], (err) => {
                    if (err) return res.status(500).json({ success: false, message: 'Server error' });
                    res.json({ success: true, message: 'Password updated successfully.' });
                });
            });
        });
    });
});

// Add new address
app.post('/api/address/add', authenticateToken, (req, res) => {
    const userID = req.user.id;
    const { recipientName, addressLine1, addressLine2, city, postalCode, country, isDefault } = req.body;
    const query = `
        INSERT INTO addresses (userID, recipientName, addressLine1, addressLine2, city, postalCode, country, isDefault)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [userID, recipientName, addressLine1, addressLine2, city, postalCode, country, isDefault], (err, result) => {
        if (err) {
            console.error('Error adding address:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, addressID: result.insertId });
    });
});

// Edit address
app.put('/api/address/edit/:id', authenticateToken, (req, res) => {
    const userID = req.user.id;
    const addressID = req.params.id;
    const { recipientName, addressLine1, addressLine2, city, postalCode, country, isDefault } = req.body;
    const query = `
        UPDATE addresses
        SET recipientName = ?, addressLine1 = ?, addressLine2 = ?, city = ?, postalCode = ?, country = ?, isDefault = ?
        WHERE addressID = ? AND userID = ?
    `;
    db.query(query, [recipientName, addressLine1, addressLine2, city, postalCode, country, isDefault, addressID, userID], (err, result) => {
        if (err) {
            console.error('Error updating address:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
        }
        res.json({ success: true, message: 'Address updated successfully' });
    });
});

// Admin Dashboard
app.get('/api/admin-dashboard', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the Admin Dashboard!',
    });
});

// Get all users
app.get('/api/userlist', authenticateToken, (req, res) => {
    const query = 'SELECT userID, username, email, role, createdAt FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, users: results });
    });
});

// get all products (admin)
app.get('/api/admin-products', (req, res) => {
    const query = 'SELECT * FROM products ORDER BY createdAt DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Server error');
        } else {
            res.json({ success: true, products: results });
        }
    });
});

// Approve or disapprove a product (admin only)
app.put('/api/approve-product', authenticateToken, (req, res) => {
    const { productID, isApproved } = req.body;

    // Optionally, check if user is admin (role === 1)
    if (req.user.role !== 1) {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }

    if (typeof productID === 'undefined' || typeof isApproved === 'undefined') {
        return res.status(400).json({ success: false, message: 'Missing productID or isApproved.' });
    }

    const query = 'UPDATE products SET isApproved = ? WHERE productID = ?';
    db.query(query, [isApproved, productID], (err, result) => {
        if (err) {
            console.error('Error updating product approval:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.json({ success: true, message: 'Product approval status updated.' });
    });
});

// Seller Dashboard
app.get('/api/seller-dashboard', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the Seller Dashboard!',
    });
});

// Get all products for a specific seller
app.get('/api/seller-products', authenticateToken, (req, res) => {
    //console.log('Authenticated user:', req.user);
    const sellerID = req.user.id; // Extract seller ID from the authenticated user
    
    const query = 'SELECT productID, name, price, stock, imageURL, isApproved, createdAt FROM products WHERE sellerID = ?';
    db.query(query, [sellerID], (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, products: results });
    });
});


app.get('/api/seller-products/:id', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM products WHERE productID = ? AND sellerID = ?';
    const sellerID = req.user.id; // Extract seller ID from the authenticated user

    //console.log('Authenticated user:', req.user);
    //console.log('Product ID:', req.params.id);

    db.query(query, [req.params.id, sellerID], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Product not found');
        } else {
            res.json({ success: true, product: results[0] });
        }
    });
});

app.post('/api/seller-products/add', authenticateToken, (req, res) => {
    const sellerID = req.user.id; // Extract seller ID from the authenticated user
    const { name, description, price, stock, imageURL, isHidden} = req.body;

    const query = 'INSERT INTO products (sellerID, name, description, price, stock, imageURL) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [sellerID, name, description, price, stock, imageURL, isHidden], (err, results) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, message: 'Product added successfully', productID: results.insertId });
    });
});

app.put('/api/seller-products/edit/:id', authenticateToken, (req, res) => {
    const sellerID = req.user.id; // Extract seller ID from the authenticated user
    const { id } = req.params;
    const { name, description, price, stock, imageURL, isHidden} = req.body;

    const query = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, imageURL = ? WHERE productID = ? AND sellerID = ?';

    db.query(query, [name, description, price, stock, imageURL, id, sellerID], (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
        }
        res.json({ success: true, message: 'Product updated successfully' });
    });
});

// Get all order items for products belonging to the logged-in seller
app.get('/api/seller-orders', authenticateToken, (req, res) => {
    const sellerID = req.user.id;
    // Join orderItem, orders, products, and users for richer info
    const query = `
        SELECT 
            oi.orderItemID,
            oi.orderID,
            oi.productID,
            oi.quantity,
            oi.price,
            o.createdAt AS orderDate,
            o.status AS orderStatus,
            u.username AS customerName,
            p.name AS productName,
            p.imageURL
        FROM orderItem oi
        JOIN products p ON oi.productID = p.productID
        JOIN orders o ON oi.orderID = o.orderID
        JOIN users u ON o.userID = u.userID
        WHERE p.sellerID = ?
        ORDER BY o.createdAt DESC
    `;
    db.query(query, [sellerID], (err, results) => {
        if (err) {
            console.error('Error fetching seller order items:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        res.json({ success: true, orderItems: results });
    });
});

// Update order status (admin or seller)
app.put('/api/order/:orderID/status', authenticateToken, (req, res) => {
    const { orderID } = req.params;
    const { status } = req.body;

    // Validate status is a number and in allowed range
    if (![1,2,3,4,5,6,7].includes(Number(status))) {
        return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const query = 'UPDATE orders SET status = ? WHERE orderID = ?';
    db.query(query, [status, orderID], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }
        res.json({ success: true, message: 'Order status updated successfully.' });
    });
});

// get all products
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products WHERE isApproved = 1 ORDER BY createdAt DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Server error');
        } else {
            res.json({ success: true, products: results });
        }
    });
});

app.get('/api/product/:id', (req, res) => {
    const query = 'SELECT * FROM products WHERE productID = ? AND isApproved = 1';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Product not found');
        } else {
            res.json({ success: true, product: results[0] });
        }
    });
});

app.get('/api/latestProducts', (req, res) => {
    const query = 'SELECT * FROM products WHERE isApproved = 1 ORDER BY createdAt DESC LIMIT 3';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// Get all orders for the logged-in customer
app.get('/api/my-orders', authenticateToken, (req, res) => {
    const userID = req.user.id;
    const ordersQuery = `
        SELECT orderID, totalAmount, status, createdAt
        FROM orders
        WHERE userID = ?
        ORDER BY createdAt DESC
    `;
    db.query(ordersQuery, [userID], (err, orders) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        // Optionally, fetch order items for each order
        res.json({ success: true, orders });
    });
});

// Get order detail for a specific order (only for the owner)
app.get('/api/my-orders/:orderID', authenticateToken, (req, res) => {
    const userID = req.user.id;
    const orderID = req.params.orderID;

    // Get order, address, and items
    const orderQuery = `
        SELECT o.orderID, o.totalAmount, o.status, o.createdAt,
               a.recipientName, a.addressLine1, a.addressLine2, a.city, a.postalCode, a.country
        FROM orders o
        JOIN addresses a ON o.addressID = a.addressID
        WHERE o.orderID = ? AND o.userID = ?
    `;
    db.query(orderQuery, [orderID, userID], (err, orderResults) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        if (orderResults.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });

        const order = orderResults[0];
        const itemsQuery = `
            SELECT oi.orderItemID, oi.productID, oi.quantity, oi.price, p.productID, p.name, p.imageURL
            FROM orderItem oi
            JOIN products p ON oi.productID = p.productID
            WHERE oi.orderID = ?
        `;
        db.query(itemsQuery, [orderID], (err, itemsResults) => {
            if (err) return res.status(500).json({ success: false, message: 'Server error' });
            res.json({ success: true, order, items: itemsResults });
        });
    });
});

// Place order and handle payment (mock)
app.post('/api/place-order', authenticateToken, (req, res) => {
    const userID = req.user.id;
    const { addressID, cart, total, payment } = req.body;

    // Basic validation
    if (!addressID || !Array.isArray(cart) || cart.length === 0 || !total || !payment) {
        return res.status(400).json({ success: false, message: 'Missing order information.' });
    }

    // Mock payment validation (in real app, integrate with payment gateway)
    if (
        !/^\d{16}$/.test(payment.cardNumber) ||
        !/^\d{2}\/\d{2}$/.test(payment.expiry) ||
        !/^\d{3,4}$/.test(payment.cvv)
    ) {
        return res.status(400).json({ success: false, message: 'Invalid payment details.' });
    }

    // Insert order into orders table (status 1: pending)
    const orderQuery = `
        INSERT INTO orders (userID, addressID, totalAmount, status)
        VALUES (?, ?, ?, 1)
    `;
    db.query(orderQuery, [userID, addressID, total], (err, orderResult) => {
        if (err) {
            console.error('Error placing order:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
        const orderID = orderResult.insertId;

        // Insert each cart item into orderItem table
        const orderItems = cart.map(item => [
            orderID,
            item.productID,
            item.quantity,
            item.price
        ]);
        const orderItemsQuery = `
            INSERT INTO orderItem (orderID, productID, quantity, price)
            VALUES ?
        `;
        db.query(orderItemsQuery, [orderItems], (err) => {
            if (err) {
                console.error('Error inserting order items:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            // Insert payment record (paymentMethod 1: credit card, paymentStatus 1: success)
            const paymentQuery = `
                INSERT INTO payment (orderID, paymentMethod, paymentStatus)
                VALUES (?, 1, 1)
            `;
            db.query(paymentQuery, [orderID], (err) => {
                if (err) {
                    console.error('Error inserting payment:', err);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }

                // Update order status to 2 (processing) after payment success
                const updateOrderStatusQuery = `
                    UPDATE orders SET status = 2 WHERE orderID = ?
                `;
                db.query(updateOrderStatusQuery, [orderID], (err) => {
                    if (err) {
                        console.error('Error updating order status:', err);
                        return res.status(500).json({ success: false, message: 'Server error' });
                    }
                    res.json({ success: true, message: 'Order placed and payment processed.', orderID });
                });
            });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});