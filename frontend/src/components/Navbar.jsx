import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiSearch } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { setIsCartOpen } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const allProducts = [
    "Soft Maternity Dress",
    "Eco Nursing Shirt",
    "Organic Belly Band",
    "Daily Maternity Pants",
    "Comfort Socks",
    "Dress Delight",
    "Maternity Toy Set"
  ];

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchTerm(input);

    if (input.length === 0) {
      setSuggestions([]);
      return;
    }

    const startsWith = allProducts.filter(item =>
      item.toLowerCase().startsWith(input)
    );

    const contains = allProducts.filter(item =>
      item.toLowerCase().includes(input) && !item.toLowerCase().startsWith(input)
    );

    const combined = [...startsWith, ...contains];

    setSuggestions(combined.length > 0 ? combined : ['__no_results__']);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link to="/">She’s Sustainable</Link>
      </div>

      <form className="navbar__search" onSubmit={(e) => e.preventDefault()}>
        <FiSearch color="var(--color-brand)" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <ul className="search-suggestions">
            {suggestions[0] === '__no_results__' ? (
              <li style={{ color: 'var(--color-text)', fontStyle: 'italic' }}>No results found</li>
            ) : (
              suggestions.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            )}
          </ul>
        )}
      </form>

      <div className="navbar__links">
        <button className="sell-new-button" onClick={() => navigate('/shop')}>
          Sell New
        </button>

        <button onClick={() => setIsCartOpen(true)} className="icon-button" aria-label="Open cart">
          <FiShoppingBag />
        </button>

        <div className="profile-dropdown-container" ref={dropdownRef}>
          <button className="icon-button" onClick={toggleDropdown} aria-label="User options">
            <FiUser />
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <div onClick={() => { navigate('/profile'); setShowDropdown(false); }}>
                Your Profile
              </div>
              <div onClick={() => { navigate('/shop'); setShowDropdown(false); }}>
                Your Shop
              </div>
              <div>Settings</div>
              <div>Log out</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;