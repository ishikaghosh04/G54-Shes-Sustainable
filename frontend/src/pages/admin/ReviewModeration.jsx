import React, { useEffect, useState, useContext } from 'react';
import './ReviewModeration.css';
import API from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';

const ReviewModeration = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [abusiveReviews, setAbusiveReviews] = useState([]);

  useEffect(() => {
    if (!user?.isAdmin) return navigate('/login');

    API.get('/admin/abusive-reviews')
      .then(res => setAbusiveReviews(res.data))
      .catch(err => console.error('Failed to load abusive reviews:', err));
  }, [user, navigate]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/review/${id}`);
      setAbusiveReviews(prev => prev.filter(r => r.reviewID !== id));
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err);
    }
  };

  return (
    <div className="review-moderation-page">
      <h2>🚨 Abusive Reviews</h2>
      {abusiveReviews.length === 0 ? (
        <p>No flagged reviews at the moment.</p>
      ) : (
        <ul className="review-list">
          {abusiveReviews.map((review) => (
            <li key={review.reviewID} className="review-card">
              <div className="review-content">
                <p><strong>Buyer ID:</strong> {review.buyerID}</p>
                <p><strong>Comment:</strong> {review.comment}</p>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(review.reviewID)}
              >
                <FiTrash2 /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewModeration;
