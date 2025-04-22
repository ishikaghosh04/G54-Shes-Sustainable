import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Confirmation.css';
import { FiCheckCircle } from 'react-icons/fi';

const ConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  //  Hardcoded
  const testData = {
    productName: 'Floral Summer Dress',
    sellerName: 'Jane Doe',
    sellerEmail: 'jane@example.com',
    date: 'April 23, 2025',
    time: '2:30 PM',
    eta: 'April 30, 2025',
  };

  const order = state || testData;
  const { productName, sellerName, sellerEmail, date, time, eta } = order;

  return (
    <div className="confirmation-page">
      <FiCheckCircle className="confirmation-icon" />
      <h2>Thank You for Your Order!</h2>
      <p>Your payment was successful. Here are your order details:</p>

      <div className="order-summary">
        <p><strong>Product:</strong> {productName}</p>
        <p><strong>Ordered on:</strong> {date} at {time}</p>
        <p><strong>Estimated Arrival:</strong> {eta}</p>
        <hr />
        <h3>Seller Contact</h3>
        <p><strong>Name:</strong> {sellerName}</p>
        <p><strong>Email:</strong> <a href={`mailto:${sellerEmail}`}>{sellerEmail}</a></p>
      </div>

      <button className="btn btn-primary" onClick={() => navigate('/profile')}>View Your Profile</button>
    </div>
  );
};

export default ConfirmationPage;