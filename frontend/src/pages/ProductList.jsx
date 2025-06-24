import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(response => response.json())
            .then(data => setProducts(data.products))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

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