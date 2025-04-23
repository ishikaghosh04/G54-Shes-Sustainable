import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JaneDoe.css';

const JaneDoe = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/product/floral-summer-dress');
  };

  return (
    <div className="seller-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>

      <h2 className="seller-name">Jane Doe</h2>
      <p className="seller-email">Email: <a href="mailto:jane@example.com">jane@example.com</a></p>

      <h3 className="items-title">Items Sold</h3>
      <div className="items-grid">
        <div className="item-card">
          <img
            src="/images/SummerTop.jpg"
            alt="Summer Top"
            className="sold-item-image"
          />
          <p>Summer Top</p>
          <p className="sold-date">Sold on April 15, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Ishika:</strong> Perfect for the summers~~</p>
          </div>
        </div>

        <div className="item-card">
          <img
            src="/images/NursingTop.jpg"
            alt="Breathable Nursing Top"
            className="sold-item-image"
          />
          <p>Breathable Nursing Top</p>
          <p className="sold-date">Sold on March 2, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Fatima:</strong> Best Purchase Ever</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JaneDoe;
