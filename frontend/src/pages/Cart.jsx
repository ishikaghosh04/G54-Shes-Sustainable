import React, { useEffect,useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, loadCart } = useContext(CartContext);
 
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/cart') {
      loadCart();
    }
  }, [pathname, loadCart]);
 
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-message">Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              {item.name} — ${item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
