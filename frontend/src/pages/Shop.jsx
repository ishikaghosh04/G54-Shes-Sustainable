import React from 'react';
import { Link } from 'react-router-dom';

const soldItems = [
  { name: 'Organic Nursing Shirt', date: 'March 14, 2025' },
  { name: 'Soft Maternity Dress', date: 'April 2, 2025' }
];

const Shop = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Shop 🛍️</h2>
      <p>Items you’ve sold so far:</p>

      <ul>
        {soldItems.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> – Sold on {item.date}
          </li>
        ))}
      </ul>

      <Link to="/shop/add">
        <button style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          ➕ Add New Item
        </button>
      </Link>
    </div>
  );
};

export default Shop;
