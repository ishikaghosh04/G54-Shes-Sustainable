import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    navigate('/payment'); // ✅ Now goes to payment after this page
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>Shipping Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Fields here... (same as before) */}
        <label>Street Address:</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Province:</label>
        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={handleChange}
          required
        />
        <br /><br />

        <label>Postal Code:</label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Continue to Payment</button>
      </form>
    </div>
  );
};

export default Shipping;
