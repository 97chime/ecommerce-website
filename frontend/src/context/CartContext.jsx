import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) setCart(JSON.parse(storedCart));
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.productID === product.productID);
            if (existing) {
                return prev.map(item =>
                    item.productID === product.productID
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productID) => {
        setCart(prev => prev.filter(item => item.productID !== productID));
    };

    const updateQuantity = (productID, quantity) => {
        setCart(prev =>
            prev.map(item =>
                item.productID === productID ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};