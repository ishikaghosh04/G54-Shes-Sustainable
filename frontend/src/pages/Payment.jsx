import React from 'react';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Payment = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Processing payment...');
    // TODO: Add payment API integration
  };

  return (
    <div className="payment-page">
      {/* Back to Shipping Button */}
      <div className="back-button" onClick={() => navigate('/shipping')}>
        <FiArrowLeft size={18} style={{ marginRight: '8px' }} />
        <span>Back to Shipping</span>
      </div>

      <h2>💳 Payment</h2>
      <p className="payment-subtitle">Enter your payment details below:</p>

      <form className="payment-form" onSubmit={handleSubmit}>
        <label>Card Number</label>
        <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx" required />

        <label>Expiration Date</label>
        <input type="text" placeholder="MM/YY" required />

        <label>CVV</label>
        <input type="text" placeholder="123" required />

        <label>Billing Address</label>
        <input type="text" placeholder="123 Main St" required />

        <button type="submit" className="btn btn-primary">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
