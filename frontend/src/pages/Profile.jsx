import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const mockUser = {
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    phone: '123-456-7890',
    address: '123 Maternity Ave, Calgary, AB',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Profile</h2>

      {/* Basic Info */}
      <div style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {mockUser.name}</p>
        <p><strong>Email:</strong> {mockUser.email}</p>
        <p><strong>Phone:</strong> {mockUser.phone}</p>
        <button>Edit Profile</button>
      </div>

      {/* Shipping Info */}
      <div style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <h3>Shipping Address</h3>
        <p>{mockUser.address}</p>
        <button>Update Address</button>
      </div>

      {/* Order History */}
      <div style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        <h3>Order History</h3>

        <div style={{ marginBottom: '1rem' }}>
          <p>[Order 1 Placeholder]</p>
          <button onClick={() => navigate('/review')}>Leave a Review</button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p>[Order 2 Placeholder]</p>
          <button onClick={() => navigate('/review')}>Leave a Review</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
