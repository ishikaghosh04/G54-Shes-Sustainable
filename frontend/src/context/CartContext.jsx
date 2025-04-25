import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckoutContext } from '../context/CheckoutContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { setOrderSummary } = useContext(CheckoutContext);

  const [cartItems, setCartItems]   = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1️⃣ central fetch
  const loadCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const res = await API.get('/cart');
      setCartItems(res.data.items || res.data);
    } catch (err) {
      console.error('Couldn’t load cart:', err);
    }
  }, [user]);

  // on mount & when user changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // 2️⃣ actions re-use loadCart
  const addToCart = async product => {
    if (!user) {
      navigate('/login', { state: { message: 'Please log in to add items.' }});
      return;
    }
    try {
      await API.post('/cart/add', { productID: product.productID });
      await loadCart();
      setIsCartOpen(true);
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  const removeFromCart = async id => {
    try {
      await API.delete(`/cart/${id}`);
      await loadCart();
    } catch (err) {
      console.error('Remove from cart failed:', err);
    }
  };

  const processOrder = async () => {
    if (!user) {
      navigate('/login', { state: { message: 'Please log in to order.' }});
      return;
    }
    const snapshot = [...cartItems];
    try {
      const { data } = await API.post('/checkout/process-order');
      setIsCartOpen(false);
      await loadCart();  // now empty
      setOrderSummary({
        orderID:     data.orderID,
        totalAmount: data.totalAmount,
        itemsCount:  snapshot.length,
        items:       snapshot
      });
      navigate('/order');
    } catch (err) {
      console.error('Order failed:', err);
    }
  };

  // 3️⃣ derived values
  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, i) => sum + parseFloat(i.price), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      isCartOpen, setIsCartOpen,
      loadCart,
      addToCart,
      removeFromCart,
      processOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};
