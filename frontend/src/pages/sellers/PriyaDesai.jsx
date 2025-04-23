import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PriyaDesai.css';

const PriyaDesai = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/product/vintage-graphic-tshirt');
  };

  return (
    <div className="seller-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>

      <h2 className="seller-name">Priya Desai</h2>
      <p className="seller-email">Email: <a href="mailto:priya@example.com">priya@example.com</a></p>

      <h3 className="items-title">Items Sold</h3>
      <div className="items-grid">
        <div className="item-card">
          <img
            src="/images/VintageJeans.jpg"
            alt="Vintage Jeans"
            className="sold-item-image"
          />
          <p>Vintage Jeans</p>
          <p className="sold-date">Sold on March 22, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Sam:</strong> love!!!</p>
          </div>
        </div>

        <div className="item-card">
          <img
            src="/images/MaternityShorts.jpg"
            alt="Relaxed Fit Maternity Shorts"
            className="sold-item-image"
          />
          <p>Relaxed Fit Maternity Shorts</p>
          <p className="sold-date">Sold on February 2, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Jane:</strong> So soft and stylish!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriyaDesai;
