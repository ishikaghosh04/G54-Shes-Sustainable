import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const mockUser = {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    phone: '123-456-7890',
    address: '123 Maternity Ave, Calgary, AB',
  };

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
        <p><strong>Name:</strong> {mockUser.name}</p>
        <p><strong>Email:</strong> {mockUser.email}</p>
        <p><strong>Phone:</strong> {mockUser.phone}</p>
        <button className="btn btn-primary">Edit Profile</button>
      </div>

      {/* Shipping Info */}
      <div className="profile-card">
        <h3>Shipping Address</h3>
        <p>{mockUser.address}</p>
        <button className="btn btn-primary">Update Address</button>
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