import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Authorization from '../../hoc/Authorization';
import Sidebar from '../../components/Sidebar';
import '../../styles/SellerProducts.css';

const SellerProducts = () => {
    // const [products, setProducts] = useState([]);
    // const [loading, setLoading] = useState(true);
    const history = useHistory();

    // useEffect(() => {
    //     // Fetch seller's products from the backend
    //     fetch('http://localhost:5000/api/seller-products', {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token
    //         },
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data.success) {
    //                 setProducts(data.products);
    //             } else {
    //                 alert('Failed to fetch products.');
    //             }
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching products:', error);
    //             setLoading(false);
    //         });
    // }, []);

    // if (loading) {
    //     return (
    //         <div className="seller-products-container">
    //             <Sidebar />
    //             <div className="seller-products-content">
    //                 <h1>Product Overview</h1>
    //                 <div className="loading-message">Loading...</div>
    //             </div>
    //         </div>
    //     );
    // }

    const products = [
        {
            productID: 1,
            name: 'Product A',
            price: 1500, // in cents
            stock: 10,
            isApproved: true,
        },
        {
            productID: 2,
            name: 'Product B',
            price: 2500, // in cents
            stock: 5,
            isApproved: false,
        },
    ];

    return (
        <div className="seller-products-container">
            <Sidebar />
            <div className="seller-products-content">
                <h1>Product Overview</h1>
                <button
                    onClick={() => history.push('/seller-products/add')}
                    className="add-product-button"
                >
                    Add Product
                </button>
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Price (MYR)</th>
                            <th>Stock</th>
                            <th>Approved</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.productID}>
                                <td>{product.productID}</td>
                                <td>{product.name}</td>
                                <td>{(product.price / 100).toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td>{product.isApproved ? 'Yes' : 'Awaiting Approval'}</td> 
                                <td>
                                    <button
                                        onClick={() => history.push(`/seller-products/edit/${product.productID}`)}
                                        className="edit-button"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Authorization(SellerProducts, [2]); // Only allow role 2 (seller)