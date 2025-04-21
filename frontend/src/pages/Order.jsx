import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'; // Icon for the back button
import './Order.css';

const Order = () => {
  const navigate = useNavigate();

  const handleShipping = () => {
    navigate('/shipping');
  };

  const handleBackToProducts = () => {
    navigate('/product');
  };

  return (
    <div className="order-page">
      {/* Back Button */}
      <div className="back-button" onClick={handleBackToProducts}>
        <FiArrowLeft size={18} style={{ marginRight: '8px' }} />
        <span>Back to Products</span>
      </div>

      <h2>📦 Order Summary</h2>
      <p className="order-detail">[Order Details Placeholder]</p>
      <p className="order-detail">Estimated Delivery: [Date Placeholder]</p>

      <button onClick={handleShipping} className="btn btn-primary">
        Proceed to Shipping
      </button>
    </div>
  );
};

export default Order;
