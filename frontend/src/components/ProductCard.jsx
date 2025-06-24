import React from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import '../styles/ProductCard.css';
import defaultImage from '../assets/default.jpg'; // Import the default image

const ProductCard = ({ product }) => {
    const history = useHistory(); // Initialize useHistory

    const handleCardClick = () => {
        history.push(`/product/${product.productID}`); // Navigate to the ProductDetail page
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <img
                src={product.imageURL || defaultImage} // Use default image if imageURL is empty
                alt={product.name}
                className="product-image"
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = defaultImage; // Set default image if the image is broken
                }}
            />
            <h3 className="product-title">{product.name}</h3>
            <p className="product-price">MYR {(product.price / 100).toFixed(2)}</p>
        </div>
    );
};

export default ProductCard;