import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setIsCartOpen(true); // Auto-open cart when adding
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};
