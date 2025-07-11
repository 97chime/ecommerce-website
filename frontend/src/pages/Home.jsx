import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = () => {
    //const [featuredProducts, setProducts] = useState([]);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/latestProducts')
    //         .then(response => response.json())
    //         .then(data => setProducts(data))
    //         .catch(error => console.error('Error fetching products:', error));
    // }, []);

    const featuredProducts = [
        {
            productID: 1,
            name: 'Product 1',
            price: 2999,
            imageURL: 'https://live.staticflickr.com/65535/54647467055_93e6735f48_b.jpg',
            description: 'This is a great product.'
        },
        {
            productID: 2,
            name: 'Product 2',
            price: 3999,
            imageURL: 'https://live.staticflickr.com/65535/54646303777_ca7beb095c_b.jpg',
            description: 'This is another great product.'
        },
        {            
            productID: 3,
            name: 'Product 3',
            price: 4999,
            imageURL: 'https://live.staticflickr.com/65535/54647380919_34456f8a9f_b.jpg',
            description: 'This is yet another great product.'
        }
    ];

    return (
        <div className="home" test="">
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