import React, { createContext, useState, useEffect,useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckoutContext } from '../context/CheckoutContext';
// Create context
export const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();  

  const [cartItems, setCartItems]   = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { setOrderSummary } = useContext(CheckoutContext);

  
  // Load the cart on startup (will be [] if empty)
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    API.get('/cart')
      .then(res => setCartItems(res.data))
      .catch(err => console.error('Failed to load cart:', err));
  }, [user]);

  // Add an item, then re‑fetch
  const addToCart = async (product) => {
    if (!user) {
      navigate('/login', {
        state: { message: 'Please log in to add items to your cart.' }
      });
      return;
    }

    try {
      await API.post('/cart/add', { productID: product.productID });
      const res = await API.get('/cart');
      setCartItems(res.data);
      setIsCartOpen(true);
    } catch (err) {
      console.error('Add to cart failed:', err.response?.data || err);
    }
  };

  // Remove an item, then re‑fetch
  const removeFromCart = async (productID) => {
    try {
      await API.delete(`/cart/${productID}`);
      const res = await API.get('/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error('Remove from cart failed:', err.response?.data || err);
    }
  };

 /**
   * Send the cart to the server, turn it into an order,
   * then clear out the local cart and navigate to your Order page.
   */
 const processOrder = async () => {
  if (!user) {
    navigate('/login', { state: { message: 'Please log in to place an order.' }});
    return;
  }
  const itemsSnapshot = [...cartItems];
  try {
    const { data } = await API.post('/checkout/process-order');
    setIsCartOpen(false);
    setCartItems([]);                // clear local cartItems
    // send them to the Order page (or /order/:orderID)
    setOrderSummary({
        orderID:     data.orderID,
        totalAmount: data.totalAmount,
        itemsCount:  itemsSnapshot.length,
        items:       itemsSnapshot
      });
      navigate('/order');
  } catch (err) {
    console.error('Order failed:', err.response?.data || err);
  }
};

return (
  <CartContext.Provider
    value={{cartItems,addToCart,removeFromCart, processOrder,isCartOpen,setIsCartOpen,}}
  >
    {children}
  </CartContext.Provider>
);
};