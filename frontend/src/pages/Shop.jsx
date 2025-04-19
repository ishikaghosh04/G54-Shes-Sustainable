import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './Shop.css';

const soldItems = [
  { name: 'Organic Nursing Shirt', date: 'March 14, 2025' },
  { name: 'Soft Maternity Dress', date: 'April 2, 2025' }
];

const Shop = () => {
  const navigate = useNavigate();

  return (
    <div className="shop-page">
      <div className="shop-back" onClick={() => navigate('/product')}>
        <FiArrowLeft size={20} />
        <span>Back to Products</span>
      </div>

      <h2>Your Shop 🛍️</h2>
      <p className="shop-subtitle">Items you’ve sold so far:</p>

      <ul className="sold-items-list">
        {soldItems.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> – Sold on {item.date}
          </li>
        ))}
      </ul>

      <Link to="/shop/add">
        <button className="btn btn-primary shop-add-button">
          ➕ Add New Item
        </button>
      </Link>
    </div>
  );
};

export default Shop;
