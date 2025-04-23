import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RachelLim.css';

const RachelLim = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/product/organic-cotton-sweater');
  };

  return (
    <div className="seller-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>

      <h2 className="seller-name">Rachel Lim</h2>
      <p className="seller-email">Email: <a href="mailto:rachel@example.com">rachel@example.com</a></p>

      <h3 className="items-title">Items Sold</h3>
      <div className="items-grid">
        <div className="item-card">
          <div className="image-placeholder">Image</div>
          <p>Eco-Friendly Athletic Top</p>
          <p className="sold-date">Sold on April 20, 2025</p>
          <div className="item-review">
                <h4>Review</h4>
                <p><strong>Grace:</strong> how i love thrifting</p>
            </div>
        </div>
        <div className="item-card">
          <div className="image-placeholder">Image</div>
          <p>Organic Maternity Hoodie</p>
          <p className="sold-date">Sold on March 28, 2025</p>
          <div className="item-review">
                <h4>Review</h4>
                <p><strong>Maleeha:</strong> feels good knowing its sustaibale</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RachelLim;
