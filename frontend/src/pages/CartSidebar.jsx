import React, { useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CartSidebar.css';
import { FiTrash2 } from 'react-icons/fi';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, processOrder,loadCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) loadCart();
  }, [isCartOpen, loadCart]);

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
            <div className="item-header">
              <p className="item-name"><strong>{item.name}</strong></p>
              <FiTrash2
                size={18}
                className="cart-sidebar__icon"
                onClick={() => removeFromCart(item.productID)}
                aria-label="Remove item"
              />
            </div>
            <p>${item.price}</p>
          </div>
        ))
      )}

      <button
        className="cart-sidebar__order"
        onClick={processOrder}
      >
        Order Now
      </button>
    </div>
  );
};

export default CartSidebar;
