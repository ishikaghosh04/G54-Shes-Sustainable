import React, { useState } from 'react';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const Payment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    billingStreet: '',
    billingCity: '',
    billingProvince: '',
    billingPostalCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Processing payment with:', formData);
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
        <input
          type="text"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          required
        />

        <label>Expiration Date</label>
        <input
          type="text"
          placeholder="MM/YY"
          name="expiry"
          value={formData.expiry}
          onChange={handleChange}
          required
        />

        <label>CVV</label>
        <input
          type="text"
          placeholder="123"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          required
        />

        <h3 style={{ marginTop: '2rem' }}>Billing Address</h3>

        <label>Street Address</label>
        <input
          type="text"
          placeholder="123 Main St"
          name="billingStreet"
          value={formData.billingStreet}
          onChange={handleChange}
          required
        />

        <label>City</label>
        <input
          type="text"
          placeholder="Calgary"
          name="billingCity"
          value={formData.billingCity}
          onChange={handleChange}
          required
        />

        <label>Province</label>
        <input
          type="text"
          placeholder="AB"
          name="billingProvince"
          value={formData.billingProvince}
          onChange={handleChange}
          required
        />

        <label>Postal Code</label>
        <input
          type="text"
          placeholder="T2X 1V4"
          name="billingPostalCode"
          value={formData.billingPostalCode}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
