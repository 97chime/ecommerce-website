import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/ProductList.css';

const ProductList = () => {
    // const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/products')
    //         .then(response => response.json())
    //         .then(data => setProducts(data.products))
    //         .catch(error => console.error('Error fetching products:', error));
    // }, []);

    const products = [
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
        <div class="product">
            <h1>Product List</h1>
            <div className="product-list">
                <div className="product-list-container">
                    {products.map(product => (
                        <ProductCard 
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;