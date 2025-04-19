import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Shipping.css';

const Shipping = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Shipping Info Submitted:', formData);
    navigate('/payment');
  };

  return (
    <div className="shipping-page">
      {/* Back Button */}
      <div
        onClick={() => navigate('/order')}
        style={{
          cursor: 'pointer',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--color-brand)',
          fontWeight: '600',
          fontSize: '1rem',
          gap: '0.5rem'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>←</span>
        <span>Back to Order</span>
      </div>

      <h2>Shipping Details</h2>

      <div className="shipping-card">
        <form className="shipping-form" onSubmit={handleSubmit}>
          <label>Street Address:</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
          />

          <label>City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <label>Province:</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          />

          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary">
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
