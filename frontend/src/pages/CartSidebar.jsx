import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="cart-sidebar">
      <div className="cart-sidebar__header">
        <button
          onClick={() => setIsCartOpen(false)}
          className="cart-sidebar__close"
          aria-label="Close cart sidebar"
        >
          ❌
        </button>
      </div>

      <h3
        className="cart-sidebar__title"
        onClick={() => {
          setIsCartOpen(false);
          navigate('/cart');
        }}
      >
        🛍️ <span>View Full Cart</span>
      </h3>

      {cartItems.length === 0 ? (
        <p className="cart-sidebar__empty">No items yet</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} className="cart-sidebar__item">
            <p><strong>{item.name}</strong></p>
            <p>${item.price}</p>
          </div>
        ))
      )}

      <button
        className="cart-sidebar__order"
        onClick={() => {
          setIsCartOpen(false);
          navigate('/order');
        }}
      >
        Order Now
      </button>
    </div>
  );
};

export default CartSidebar;
