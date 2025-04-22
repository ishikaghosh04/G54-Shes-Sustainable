import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';


const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [user, setUser]     = useState(null);
  const [error, setError]   = useState('');

  // Fetch real profile on mount
  useEffect(() => {
    API.get('/profile')
    .then(res => setUser(res.data))
    .catch(() => setError('Failed to load profile.'));
  }, []);

  if (error) return <div className="profile-page"><p className="error">{error}</p></div>;
  if (!user) return <div className="profile-page"><p>Loading…</p></div>;

  return (
    <div className="profile-page">
      {/* Back Arrow */}
      <div className="profile-back" onClick={() => navigate('/product')}>
        <FiArrowLeft size={20} />
        <span>Back to Products</span>
      </div>

      <h2>Your Profile</h2>

      {/* Basic Info */}
      <div className="profile-card">
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
        <button className="btn btn-primary" onClick={() => navigate('/profile/edit')}>Edit Profile</button>
      </div>

      {/* Shipping Info */}
      <div className="profile-card">
        <h3>Shipping Address</h3>
       <p> {user.street},<br/>
        {user.city}, {user.province}<br/>
        {user.postalCode} </p>
        <button className="btn btn-primary" onClick={() => navigate('/profile/edit#address')}>Update Address</button>
      </div>

      {/* Order History */}
      <div className="profile-card">
        <h3>Order History</h3>

        <div className="order-history-item">
          <p>[Order 1 Placeholder]</p>
          <button className="btn btn-primary" onClick={() => navigate('/review')}>Leave a Review</button>
        </div>

        <div className="order-history-item">
          <p>[Order 2 Placeholder]</p>
          <button className="btn btn-primary" onClick={() => navigate('/review')}>Leave a Review</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;