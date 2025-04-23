import React, { useState, useEffect } from 'react';
import './CategoryBar.css';
import { FaFilter } from 'react-icons/fa';
import API from '../api';

const CategoryBar = ({ onFiltersChange = () => {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [price, setPrice] = useState(50);
  const [newnessOptions, setNewnessOptions] = useState({ new: false, gentlyUsed: false });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get("/products/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories:", err));
  }, []);

  useEffect(() => {
    const condition =
      newnessOptions.new && !newnessOptions.gentlyUsed ? 'new' :
      !newnessOptions.new && newnessOptions.gentlyUsed ? 'gently used' :
      null;

    onFiltersChange({
      category: selectedCategory,
      price,
      condition,
    });
  }, [price, newnessOptions, selectedCategory]);

  const handleNewnessChange = (type) => {
    setNewnessOptions((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const resetFilters = () => {
    setPrice(50);
    setNewnessOptions({ new: false, gentlyUsed: false });
    setSelectedCategory(null);
    onFiltersChange({});
  };

  const displayCats = ['All', ...categories];

  return (
    <div className="category-bar">
      <div className="category-options">
        {displayCats.map((cat) => (
          <button
            key={cat}
            className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
          >
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

            <button className="reset-button" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBar;
