import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import './Review.css';

const Review = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const { productID, orderID,productName } = state || {};



  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState('');
  const [questions, setQuestions] = useState({
    descriptionMatch: '',
    shippingExperience: '',
    buyAgain: ''
  });

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestions(q => ({ ...q, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // combine them into one blob:
    const fullComment = `
      ${comment}
  
      As described? ${questions.descriptionMatch}
      Shipping?      ${questions.shippingExperience}
      Buy again?     ${questions.buyAgain}
    `;
  
    try {
      await API.post("/reviews", {
        productID,
        orderID,
        rating,
        comment: fullComment.trim()
      });
      navigate("/profile", { state: { message: "Thanks for your review!" } });
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit review");
    }
  };
  
  

  return (
    <div className="review-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Leave a Review for <em>{productName}</em></h2>

      <form onSubmit={handleSubmit} className="review-form">
        {/* Star Rating */}
        <label>Overall Rating:</label>
        <div className="star-rating">
          {[1,2,3,4,5].map(star => (
            <span
              key={star}
              role="button"
              tabIndex={0}
              aria-label={`Rate ${star} star`}
              onClick={() => setRating(star)}
              onKeyDown={e => (e.key==='Enter'||e.key===' ') && setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              className={`star ${((hover||rating) >= star) ? 'active' : ''}`}
            >★</span>
          ))}
        </div>

        {/* Comments */}
        <label htmlFor="comment">Comments:</label>
        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
        />

        {/* Yes/No Questions */}
        <div className="review-question">
          <label>Was the item as described?</label>
          <label>
            <input
              type="radio" name="descriptionMatch" value="Yes"
              onChange={handleQuestionChange} required
            /> Yes
          </label>
          <label>
            <input
              type="radio" name="descriptionMatch" value="No"
              onChange={handleQuestionChange}
            /> No
          </label>
        </div>

        <div className="review-question">
          <label>How was the shipping experience?</label>
          <label>
            <input
              type="radio" name="shippingExperience" value="Excellent"
              onChange={handleQuestionChange} required
            /> Excellent
          </label>
          <label>
            <input
              type="radio" name="shippingExperience" value="Okay"
              onChange={handleQuestionChange}
            /> Okay
          </label>
          <label>
            <input
              type="radio" name="shippingExperience" value="Poor"
              onChange={handleQuestionChange}
            /> Poor
          </label>
        </div>

        <div className="review-question">
          <label>Would you buy from this seller again?</label>
          <label>
            <input
              type="radio" name="buyAgain" value="Yes"
              onChange={handleQuestionChange} required
            /> Yes
          </label>
          <label>
            <input
              type="radio" name="buyAgain" value="No"
              onChange={handleQuestionChange}
            /> No
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Submit Review</button>
      </form>
    </div>
  );
};

export default Review;
