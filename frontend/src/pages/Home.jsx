import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = () => {
    const [featuredProducts, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/latestProducts')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <div className="home">
            <h1>Welcome to Our E-Commerce Store</h1>
            <h2>Featured Products</h2>
            <div className="product-list">
                {featuredProducts.map(product => (
                    <ProductCard 
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;