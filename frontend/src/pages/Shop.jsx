import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import './Shop.css';

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [activeListings, setActiveListings] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const fetchActiveListings = () => {
    if (user?.userID) {
      API.get(`/products/seller/${user.userID}`)
        .then(res => setActiveListings(res.data))
        .catch(err => console.error('Failed to fetch active listings:', err));
    }
  };

  useEffect(() => {
    if (!user) return;

    // Fetch active listings
    fetchActiveListings();

    // Fetch sold items
    API.get('/profile/sold-products')
      .then(res => setSoldItems(res.data))
      .catch(err => console.error('Failed to fetch sold items:', err));
  }, [user, location.state?.refresh]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/listings/delete/${id}`);
      setActiveListings(prev => prev.filter(p => p.productID !== id));
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err);
    }
  };

  return (
    <div className="shop-page">
      <div className="shop-back" onClick={() => navigate('/product')}>
        <FiArrowLeft size={20} />
        <span>Back to Products</span>
      </div>

      <h2>Your Shop 🍭️</h2>

      <div className="shop-section">
        <h3>Active Listings</h3>
        {activeListings.length === 0 ? (
          <p>No active listings yet.</p>
        ) : (
          <ul className="shop-listings">
            {activeListings.map(item => (
              <li key={item.productID} className="listing-item">
                
                <div className="listing-card">
                  <img
                    src={`/images/${item.picture}`}
                    alt={item.name}
                    className="listing-image"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/120x120.png?text=No+Image" }}
                  />
                  <div className="listing-info">
                    <strong>{item.name}</strong> 
                    <p>${item.price}</p>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.productID)}
                >
                  <FiTrash2 /> Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="shop-section">
        <h3>Sold Items</h3>
        {soldItems.length === 0 ? (
          <p>No items sold yet.</p>
        ) : (
          <ul className="sold-items-list">
            {soldItems.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong> – Sold on {new Date(item.soldDate).toLocaleDateString()}
                {item.review && (
                  <div className="review">
                    <em>“{item.review.comment}” – {item.review.reviewerName}</em>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/shop/add">
        <button className="btn btn-primary shop-add-button">
        ➕ Add New Item
        </button>
      </Link>
    </div>
  );
};

export default Shop;
