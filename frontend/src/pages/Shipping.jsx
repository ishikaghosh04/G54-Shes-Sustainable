import React, { useContext, useState, useEffect } from 'react';
import { CheckoutContext } from '../context/CheckoutContext';
import { useNavigate } from 'react-router-dom';
import './Shipping.css';
import API from '../api';  

const Shipping = () => {
  const navigate = useNavigate();
  const { orderSummary,shippingInfo,setShippingInfo } = useContext(CheckoutContext);

  const [formData, setFormData] = useState({
    shippingStreet:    shippingInfo.shippingStreet || '',
    shippingCity:      shippingInfo.shippingCity     || '',
    shippingProvince:  shippingInfo.shippingProvince || '',
    shippingPostalCode:shippingInfo.shippingPostalCode|| '',
    useProfileAddress: shippingInfo.useProfileAddress|| false
    });

  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderSummary?.orderID) { navigate('/order');}
  }, [orderSummary, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({...prev,[name]: type === 'checkbox' ? checked : value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        shippingStreet:    formData.shippingStreet,
        shippingCity:      formData.shippingCity,
        shippingProvince:  formData.shippingProvince,
        shippingPostalCode:formData.shippingPostalCode,
        useProfileAddress: formData.useProfileAddress
      };
      await API.post( `/shipping/order/${orderSummary.orderID}`,payload);
      setShippingInfo(payload);

      navigate('/payment');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save shipping.');
    }
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
      {error && <p className="error">{error}</p>}

      <div className="shipping-card">
        <form className="shipping-form" onSubmit={handleSubmit}>

     <span> <label className="use-profile-label">
       <input type="checkbox" name="useProfileAddress" checked={formData.useProfileAddress} onChange={handleChange}
      /> Use my profile address
      </label></span>

        {!formData.useProfileAddress && (
          <>
          <label>Street Address:</label>
          <input
            name="shippingStreet"
              value={formData.shippingStreet}
              onChange={handleChange}
              required
          />

          <label>City:</label>
          <input
           name="shippingCity"
           value={formData.shippingCity}
           onChange={handleChange}
           required
         />

          <label>Province:</label>
          <input
            name="shippingProvince"
            value={formData.shippingProvince}
            onChange={handleChange}
            required
          />

          <label>Postal Code:</label>
          <input
            name="shippingPostalCode"
            value={formData.shippingPostalCode}
            onChange={handleChange}
            required
          />
        </>
      )}

          <button type="submit" className="btn btn-primary">
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
