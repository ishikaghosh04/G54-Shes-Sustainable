import React, { useState } from 'react';
import './Review.css';

const Review = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [review, setReview] = useState('');
  const [questions, setQuestions] = useState({
    descriptionMatch: '',
    shippingExperience: '',
    buyAgain: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", {
      rating,
      review,
      ...questions
    });
    // TODO: Connect this to your backend or product page
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="review-page">
      <h2>Leave a Review</h2>

      <form onSubmit={handleSubmit} className="review-form">
        {/* ⭐ Star Rating */}
        <label>Overall Rating:</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              role="button"
              tabIndex={0}
              aria-label={`Rate ${star} star`}
              onClick={() => setRating(star)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setRating(star);
              }}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              className={`star ${((hover || rating) >= star) ? 'active' : ''}`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Review Text */}
        <label htmlFor="review">Comments:</label>
        <textarea
          id="review"
          rows="4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />

        {/* Questions */}
        <div className="review-question">
          <label>Was the item as described?</label>
          <div className="radio-group">
            <label><input type="radio" name="descriptionMatch" value="Yes" onChange={handleQuestionChange} required /> Yes</label>
            <label><input type="radio" name="descriptionMatch" value="No" onChange={handleQuestionChange} /> No</label>
          </div>
        </div>

        <div className="review-question">
          <label>How was the shipping experience?</label>
          <div className="radio-group">
            <label><input type="radio" name="shippingExperience" value="Excellent" onChange={handleQuestionChange} required /> Excellent</label>
            <label><input type="radio" name="shippingExperience" value="Okay" onChange={handleQuestionChange} /> Okay</label>
            <label><input type="radio" name="shippingExperience" value="Poor" onChange={handleQuestionChange} /> Poor</label>
          </div>
        </div>

        <div className="review-question">
          <label>Would you buy from this seller again?</label>
          <div className="radio-group">
            <label><input type="radio" name="buyAgain" value="Yes" onChange={handleQuestionChange} required /> Yes</label>
            <label><input type="radio" name="buyAgain" value="No" onChange={handleQuestionChange} /> No</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Submit Review</button>
      </form>
    </div>
  );
};

export default Review;
