import React from 'react';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const navigate = useNavigate();

  const handleShipping = () => {
    navigate('/shipping'); // ✅ redirect to shipping now
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Order Summary</h2>
      <p>[Order Details Placeholder]</p>
      <p>Estimated Delivery: [Date Placeholder]</p>

      <button onClick={handleShipping}>Proceed to Shipping</button> {/* changed label */}
    </div>
  );
};

export default Order;
