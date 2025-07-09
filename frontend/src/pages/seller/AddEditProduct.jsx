import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Authorization from '../../hoc/Authorization';
import '../../styles/AddEditProduct.css';

const AddEditProduct = () => {
    const { id } = useParams(); // Get product ID from the URL (if editing)
    const history = useHistory();

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageURL: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const [isEditing, setIsEditing] = useState(false);

    // useEffect(() => {
    //     if (id) {
    //         // Fetch product details if editing
    //         fetch(`http://localhost:5000/api/seller-products/${id}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //             },
    //         })
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 if (data) {
    //                     setProduct(data.product);
    //                     setIsEditing(true);

    //                     //alert('createdAt: '+ product.createdAt);
    //                     //alert('createdAt: ' + new Date(data.createdAt).toLocaleString());
    //                 } else {
    //                     alert('Product not found');
    //                     history.push('/seller-products');
    //                 }
    //             })
    //             .catch((error) => console.error('Error fetching product:', error));
    //     }
    // }, [id, history]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        const priceInCents = parseFloat(value) * 100; // Convert to minor currency units
        setProduct({ ...product, [name]: priceInCents });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // const url = isEditing
        //     ? `http://localhost:5000/api/seller-products/edit/${id}`
        //     : 'http://localhost:5000/api/seller-products/add';

        // const method = isEditing ? 'PUT' : 'POST';

        // fetch(url, {
        //     method: method,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     },
        //     body: JSON.stringify(product),
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (data.success) {
        //             alert(isEditing ? 'Product updated successfully' : 'Product added successfully');
        //             history.push('/seller-products');
        //         } else {
        //             alert(data.message || 'Failed to save product');
        //         }
        //     })
        //     .catch((error) => console.error('Error saving product:', error));
    };

    return (
        <div className="add-edit-product-container">
            <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={(product.price / 100).toFixed(2)}
                        onChange={handlePriceChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="text"
                        name="imageURL"
                        value={product.imageURL}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="submit-button">
                    {isEditing ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={ () => {history.goBack()}} className="back-button">
                    Back
                </button>
            </form>
        </div>
    );
};

export default Authorization(AddEditProduct, [2]); // Only allow role 2 (seller)