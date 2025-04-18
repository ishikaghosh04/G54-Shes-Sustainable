import React, { useState } from 'react';
import './CategoryBar.css';
import { FaFilter } from 'react-icons/fa';

const CategoryBar = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [price, setPrice] = useState(50);
  const [newness, setNewness] = useState(50);

  const categories = ['Tops', 'Pants', 'Toys', 'Socks', 'Dress'];

  return (
    <div className="category-bar">
      <div className="category-options">
        {categories.map((cat, index) => (
          <button key={index} className="category-button">{cat}</button>
        ))}
      </div>

      <div className="filter-container">
        <button className="filter-icon" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters
        </button>

        {showFilters && (
          <div className="filter-dropdown">
            <label>
              Price Range: ${price}
              <input
                type="range"
                min="0"
                max="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <label>
              Newness: {newness}%
              <input
                type="range"
                min="0"
                max="100"
                value={newness}
                onChange={(e) => setNewness(e.target.value)}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
