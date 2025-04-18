import React from 'react';

const Payment = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>💳 Payment</h2>
      <p>Enter your payment details below:</p>

      <form>
        <label>Card Number:</label><br />
        <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx" /><br /><br />

        <label>Expiration Date:</label><br />
        <input type="text" placeholder="MM/YY" /><br /><br />

        <label>CVV:</label><br />
        <input type="text" placeholder="123" /><br /><br />

        <label>Billing Address:</label><br />
        <input type="text" placeholder="123 Main St" /><br /><br />

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
