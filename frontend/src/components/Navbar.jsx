import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser } from 'react-icons/fi'; // removed FiSearch
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { setIsCartOpen } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
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

      {/* 👇 Mission Replaces Search */}
      <div className="navbar__mission">
        <h4>Redefining maternity fashion.</h4>
        <p>
          We connect mindful motherhood
          with fashion that feels like home.
        </p>
      </div>

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