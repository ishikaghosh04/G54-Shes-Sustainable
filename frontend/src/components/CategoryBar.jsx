import React, { useState, useEffect } from 'react';
import './CategoryBar.css';
import { FaFilter } from 'react-icons/fa';
import API from '../api';

const CategoryBar = ({ onSelectCategory = () => {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [price, setPrice] = useState(50);
  const [newnessOptions, setNewnessOptions] = useState({
    new: false,
    gentlyUsed: false,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/products/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  const handleNewnessChange = (type) => {
    setNewnessOptions((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };
  const displayCats = ['All', ...categories];

  return (
    <div className="category-bar">
      <div className="category-options">
        {displayCats.map((cat) => (
          <button key={cat} className="category-button" onClick={() => onSelectCategory(cat === 'All' ? null : cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-container">
        <button
          className="filter-icon"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
        >
          <FaFilter /> Filters
        </button>

        {showFilters && (
          <div className="filter-dropdown">
            <label>
              <span style={{ fontWeight: '600', color: 'var(--color-text)' }}>
                Price Range: ${price}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '100%' }}
              />
            </label>

            <div className="checkbox-group">
              <span>Newness:</span>
              <label>
                <input
                  type="checkbox"
                  checked={newnessOptions.new}
                  onChange={() => handleNewnessChange('new')}
                />
                New
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newnessOptions.gentlyUsed}
                  onChange={() => handleNewnessChange('gentlyUsed')}
                />
                Gently Used
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
