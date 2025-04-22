import React from 'react';
import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'; // Icon for the back button
import './Order.css';
import API from '../api'; 
import { CheckoutContext }           from '../context/CheckoutContext';

const Order = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderSummary,setCartItems } = useContext(CheckoutContext);

  const handleShipping = () => {
    navigate('/shipping');
  };

  const handleReturnToBrowsing = async () => {
    try {
      await API.post('/checkout/return-to-browsing');
      const cartRes = await API.get('/cart');
      setCartItems(cartRes.data);
      navigate('/product');
    } catch (err) {
      console.error('Could not reactivate cart:', err.response?.data || err);
      navigate('/product');
    }
  };

  const summary = state || orderSummary;
  if (!summary) {
    return (
      <div>
        <p className="order-detail"  padding = "0.75" >No order found. Please start at the products page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/product')}>Back to Products</button>
      </div>
    );
  }

  const { orderID, totalAmount, items, itemsCount } = summary;
  return (
    <div className="order-page">
      {/* Back Button */}
      <div className="back-button" onClick={handleReturnToBrowsing}>
        <FiArrowLeft size={18} style={{ marginRight: '8px' }} />
        <span>Back to Products</span>
      </div>

      <h2>📦 Order Summary</h2>

      <ul className="order-items">
      {items.map(item => (
      <li key={item.productID} className="order-item">
        {item.name} — ${parseFloat(item.price).toFixed(2)}
      </li>
          ))}
          <li className="order-item order-total"> Total Amount: <strong>${totalAmount.toFixed(2)} </strong></li>
      </ul>
      

      <button onClick={handleShipping} className="btn btn-primary">
        Proceed to Shipping
      </button>
    </div>
  );
};

export default Order;
