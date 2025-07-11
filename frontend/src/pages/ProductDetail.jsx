import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';
import defaultImage from '../assets/default.jpg';

const ProductDetail = () => {
    const { id } = useParams(); // Get the product ID from the URL
    //const [product, setProduct] = useState(null);
    const { addToCart } = useCart();

    // useEffect(() => {
    //     // Fetch product details from the backend
    //     fetch(`http://localhost:5000/api/product/${id}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data.success) {
    //                 setProduct(data.product);
    //             } else {
    //                 alert('Failed to fetch product details.');
    //             }
    //         })
    //         .catch((error) => console.error('Error fetching product details:', error));
    // }, [id]);

    const product = {
        productID: id,
        name: 'Sample Product',
        price: 2999, // Price in cents
        imageURL: 'https://live.staticflickr.com/65535/54647467055_93e6735f48_b.jpg', 
        description: 'This is a sample product description.'
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail">
            <div className="product-image-container">
                <img
                    src={product.imageURL || defaultImage} // Use default image if imageURL is empty
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = defaultImage; // Set default image if the image is broken
                    }}
                />
            </div>
            <div className="product-info-container">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <h2>MYR {(product.price / 100).toFixed(2)}</h2>
                <button onClick={() => addToCart(product, 1)}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetail;