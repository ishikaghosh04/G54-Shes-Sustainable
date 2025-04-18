import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      height: '100vh',
      width: '300px',
      backgroundColor: '#f8f8f8',
      borderLeft: '1px solid #ccc',
      padding: '1rem',
      zIndex: 1000,
      overflowY: 'auto',
    }}>
      {/* Optional Close Button */}
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={() => setIsCartOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          ❌
        </button>
      </div>

      {/* Clickable Header to go to /cart */}
      <h3
        onClick={() => {
          setIsCartOpen(false);    // Close sidebar
          navigate('/cart');       // Navigate to cart page
        }}
        style={{
          cursor: 'pointer',
          fontSize: '1.2rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        🛍️ <span style={{ marginLeft: '0.5rem' }}>View Full Cart</span>
      </h3>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <p>No items yet</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <p><strong>{item.name}</strong></p>
            <p>${item.price}</p>
          </div>
        ))
      )}

      <button
        onClick={() => {
          setIsCartOpen(false);
          navigate('/order');
        }}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#222',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Order Now
      </button>
    </div>
  );
};

export default CartSidebar;