import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LinaGeorge.css';

const LinaGeorge = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/product/wool-winter-scarf');
  };

  return (
    <div className="seller-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>

      <h2 className="seller-name">Lina George</h2>
      <p className="seller-email">Email: <a href="mailto:lina@example.com">lina@example.com</a></p>

      <h3 className="items-title">Items Sold</h3>
      <div className="items-grid">

        <div className="item-card">
          <img
            src="/images/Toque.jpg"
            alt="Toque"
            className="sold-item-image"
          />
          <p>Toque</p>
          <p className="sold-date">Sold on March 9, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Fatima:</strong> Warm, soft, and stylish! A winter favorite ❄️</p>
          </div>
        </div>

        <div className="item-card">
          <img
            src="/images/KnittedBabyBlanket.jpg"
            alt="Knitted Baby Blanket"
            className="sold-item-image"
          />
          <p>Knitted Baby Blanket</p>
          <p className="sold-date">Sold on January 21, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Megan:</strong> Made with Love!</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LinaGeorge;
