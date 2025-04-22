import React from 'react';
import { useNavigate } from 'react-router-dom';
import './KiaraThomas.css';

const KiaraThomas = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/product/designer-leather-boots');
  };

  return (
    <div className="seller-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>

      <h2 className="seller-name">Kiara Thomas</h2>
      <p className="seller-email">Email: <a href="mailto:kiara@example.com">kiara@example.com</a></p>

      <h3 className="items-title">Items Sold</h3>
      <div className="items-grid">
        <div className="item-card">
          <div className="image-placeholder">Image</div>
          <p>Designer Leather Boots</p>
          <p className="sold-date">Sold on March 14, 2025</p>
        </div>
        <div className="item-card">
          <div className="image-placeholder">Image</div>
          <p>Winter Wool Shawl</p>
          <p className="sold-date">Sold on January 3, 2025</p>
          <div className="item-review">
                <h4>Review</h4>
                <p><strong>Fatima:</strong> soft comfy and sustainable love it!</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default KiaraThomas;
