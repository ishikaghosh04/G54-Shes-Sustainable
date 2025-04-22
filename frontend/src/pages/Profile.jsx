import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    phone: '123-456-7890',
    address: '123 Maternity Ave, Calgary, AB',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    console.log('✅ Updated profile info:', userInfo);
  };

  const handleSaveAddress = () => {
    setIsEditingAddress(false);
    console.log('✅ Updated address:', userInfo.address);
  };

  return (
    <div className="profile-page">
      <div className="profile-back" onClick={() => navigate('/product')}>
        <FiArrowLeft size={20} />
        <span>Back to Products</span>
      </div>

      <h2>Your Profile</h2>

      {/* Personal Info */}
      <div className="profile-card">
        <h3>Personal Information</h3>
        {isEditingProfile ? (
          <>
            <label>Name</label>
            <input name="name" value={userInfo.name} onChange={handleChange} />
            <label>Email</label>
            <input name="email" value={userInfo.email} onChange={handleChange} />
            <label>Phone</label>
            <input name="phone" value={userInfo.phone} onChange={handleChange} />
            <button className="btn btn-primary" onClick={handleSaveProfile}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Phone:</strong> {userInfo.phone}</p>
            <button className="btn btn-primary" onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
          </>
        )}
      </div>

      {/* Shipping Info */}
      <div className="profile-card">
        <h3>Shipping Address</h3>
        {isEditingAddress ? (
          <>
            <textarea
              name="address"
              value={userInfo.address}
              onChange={handleChange}
              rows="3"
            />
            <button className="btn btn-primary" onClick={handleSaveAddress}>Save Address</button>
          </>
        ) : (
          <>
            <p>{userInfo.address}</p>
            <button className="btn btn-primary" onClick={() => setIsEditingAddress(true)}>Update Address</button>
          </>
        )}
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
