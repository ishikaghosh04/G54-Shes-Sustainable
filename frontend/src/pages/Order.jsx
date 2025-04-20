import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Order.css';

const Order = () => {
  const navigate = useNavigate();

  const handleShipping = () => {
    navigate('/shipping');
  };

  return (
    <div className="order-page">
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
