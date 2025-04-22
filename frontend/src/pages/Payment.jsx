import React, { useContext, useState, useEffect } from 'react';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { CheckoutContext } from '../context/CheckoutContext';
import API from '../api';

const Payment = () => {
  const navigate = useNavigate();
  const { orderSummary, paymentInfo, setPaymentInfo} = useContext(CheckoutContext);

  const [formData, setFormData] = useState({
    paymentMethod: 'Credit Card', // a sensible default cardNumber:
    cardNumber:         paymentInfo.cardNumber || '',
    expirationDate:     paymentInfo.expirationDate || '',
    cvv:                paymentInfo.cvv || '',
    billingStreet:      paymentInfo.billingStreet || '',
    billingCity:        paymentInfo.billingCity || '',
    billingProvince:    paymentInfo.billingProvince || '',
    billingPostalCode:  paymentInfo.billingPostalCode || '',
    useProfileAddress:  paymentInfo.useProfileAddress || false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderSummary?.orderID) {
      navigate('/shipping');
    }
  }, [orderSummary, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  try {
    const payload = { ...formData };
    await API.post(`/payment/order/${orderSummary.orderID}`, payload);

    setPaymentInfo(payload);

    navigate('/confirmation', { state: { orderID: orderSummary.orderID } });
  } catch (err) {
    setError(err.response?.data?.message || 'Payment failed.');
  }
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

      {error && <p className="error">{error}</p>}

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
          name="expirationDate"
          value={formData.expirationDate}
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

        <label htmlFor="paymentMethod">Payment Method</label>
        <select>
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
          </select>


        <h3 style={{ marginTop: '2rem' }}>Billing Address</h3>
        <label>
          <input
            type="checkbox"
            name="useProfileAddress"
            checked={formData.useProfileAddress}
            onChange={handleChange}
          /> Same as profile address
        </label>

        {!formData.useProfileAddress && (
          <>
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
         </>
        )};       
        <button type="submit" className="btn btn-primary">Pay Now
        </button>
      </form>
    </div>
  );
};

export default Payment;
