import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AlishaMorgan.css';

const AlishaMorgan = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/product/designer-handbag');
  };

  return (
    <div className="seller-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Product
      </button>

      <h2 className="seller-name">Alisha Morgan</h2>
      <p className="seller-email">Email: <a href="mailto:alisha@example.com">alisha@example.com</a></p>

      <h3 className="items-title">Items Sold</h3>
      <div className="items-grid">

        <div className="item-card">
          <img
            src="/images/MaternityJeans.jpg"
            alt="Maternity Jeans"
            className="sold-item-image"
          />
          <p>Maternity Jeans</p>
          <p className="sold-date">Sold on February 28, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Fatima:</strong> I pair it up with all of my outfits and it literally fits all of my necessities!</p>
          </div>
        </div>

        <div className="item-card">
          <img
            src="/images/LeatherToteBag.jpg"
            alt="Elegant Leather Tote"
            className="sold-item-image"
          />
          <p>Elegant Leather Tote</p>
          <p className="sold-date">Sold on January 14, 2025</p>
          <div className="item-review">
            <h4>Review</h4>
            <p><strong>Maya:</strong> It is so spacious and I get compliments everywhere I go!!!</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlishaMorgan;
