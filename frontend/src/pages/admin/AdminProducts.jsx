import React, { useEffect, useState } from 'react';

const AdminProducts = () => {
    // const [products, setProducts] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/admin-products')
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.success) setProducts(data.products);
    //             setLoading(false);
    //         });
    // }, []);

    const products = [
        {
            productID: 1,
            name: 'Product A',
            price: 1500, // in cents
            stock: 10,
            sellerID: 'seller123',
            imageURL: 'https://example.com/imageA.jpg',
            createdAt: '2023-10-01T12:00:00Z',
            isApproved: true,
        },
        {
            productID: 2,
            name: 'Product B',
            price: 2500, // in cents
            stock: 5,
            sellerID: 'seller456',
            imageURL: 'https://example.com/imageB.jpg',
            createdAt: '2023-10-02T14:30:00Z',
            isApproved: false,
        }
    ];

    const handleApproveChange = async (productID, currentValue) => {
        // const nextValue = currentValue ? 0 : 1;
        // const confirmMsg = nextValue
        //     ? 'Are you sure you want to approve this product?'
        //     : 'Are you sure you want to unapprove this product?';
        // if (!window.confirm(confirmMsg)) return;

        // try {
        //     const res = await fetch('http://localhost:5000/api/approve-product', {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //         },
        //         body: JSON.stringify({ productID, isApproved: nextValue }),
        //     });
        //     const data = await res.json();
        //     if (data.success) {
        //         setProducts(products =>
        //             products.map(p =>
        //                 p.productID === productID ? { ...p, isApproved: nextValue } : p
        //             )
        //         );
        //     } else {
        //         alert(data.message || 'Failed to update approval status.');
        //     }
        // } catch (err) {
        //     alert('Failed to update approval status.');
        // }
    };

    // if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-products-container" style={{ maxWidth: 1100, margin: '40px auto' }}>
            <h2>All Products</h2>
            <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Price (MYR)</th>
                        <th>Stock</th>
                        <th>Seller ID</th>
                        <th>Image</th>
                        <th>Created At</th>
                        <th>Approved</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productID}>
                            <td>{product.productID}</td>
                            <td>{product.name}</td>
                            <td>{(product.price / 100).toFixed(2)}</td>
                            <td>{product.stock}</td>
                            <td>{product.sellerID}</td>
                            <td>
                                {product.imageURL ? (
                                    <img src={product.imageURL} alt={product.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
                            <td>{product.createdAt ? new Date(product.createdAt).toLocaleString() : '-'}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={!!product.isApproved}
                                    onChange={() => handleApproveChange(product.productID, product.isApproved)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;