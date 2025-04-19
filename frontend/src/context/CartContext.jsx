import React, { createContext, useState } from 'react';

// Create context
export const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Function to add product to cart and auto-open sidebar
  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setIsCartOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
