import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AanyaPatel.css';

const AanyaPatel = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/product/ecofriendly-yoga-pants');
  };

  return (
    <div className="seller-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>

      <h2 className="seller-name">Aanya Patel</h2>
      <p className="seller-email">Email: <a href="mailto:aanya@example.com">aanya@example.com</a></p>

      <h3 className="items-title">Items Sold</h3>
      <div className="items-grid">
        <div className="item-card">
          <img
            src="/images/MaternityPants.jpg"
            alt="Maternity Pants"
            className="sold-item-image"
          />
          <p>Maternity Pants</p>
          <p className="sold-date">Sold on April 18, 2025</p>
        </div>

        <div className="item-card">
          <img
            src="/images/MaternityTee.jpg"
            alt="Soft Maternity T-Shirt"
            className="sold-item-image"
          />
          <p>Soft Maternity T-Shirt</p>
          <p className="sold-date">Sold on March 10, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Maria:</strong> love the fact that it is sustainable!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AanyaPatel;
