import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OliviaChen.css';

const OliviaChen = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/product/vintage-denim-jacket');
  };

  return (
    <div className="seller-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>

      <h2 className="seller-name">Olivia Chen</h2>
      <p className="seller-email">Email: <a href="mailto:olivia@example.com">olivia@example.com</a></p>

      <h3 className="items-title">Items Sold</h3>
      <div className="items-grid">

        {/* First Item */}
        <div className="item-card">
          <img
            src="/images/CottonMaternityTee.jpg"
            alt="Cotton Maternity Tee"
            className="sold-item-image"
          />
          <p>Cotton Maternity Tee</p>
          <p className="sold-date">Sold on April 5, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Hannah:</strong> Great fit and quality, love the retro vibe! 🧥</p>
          </div>
        </div>

        {/* Second Item */}
        <div className="item-card">
          <img
            src="/images/CottonBabyBlanket.jpg"
            alt="Cotton Baby Blanket"
            className="sold-item-image"
          />
          <p>Cotton Baby Blanket</p>
          <p className="sold-date">Sold on February 20, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Kylie:</strong> Best Purchase ever</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OliviaChen;
