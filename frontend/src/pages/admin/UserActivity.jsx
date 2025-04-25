import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api';
import './UserActivity.css';
import { useNavigate } from 'react-router-dom';

const UserActivity = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userActivity, setUserActivity] = useState([]);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/login');
      return;
    }

    API.get('/admin/user-activity')
      .then(res => setUserActivity(res.data))
      .catch(err => console.error('Failed to load user activity:', err));
  }, [user, navigate]);

  return (
    <div className="user-activity-page">
      <h2>📋 User Activity Summary</h2>
      {userActivity.length === 0 ? (
        <p>No activity data available.</p>
      ) : (
        <table className="user-activity-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Listings</th>
              <th>Reviews</th>
            </tr>
          </thead>
          <tbody>
            {userActivity.map(u => (
              <tr key={u.userID}>
                <td>{u.userID}</td>
                <td>{u.fullName}</td>
                <td>{u.listings}</td>
                <td>{u.reviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserActivity;
