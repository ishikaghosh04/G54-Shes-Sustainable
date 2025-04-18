import React, { useState } from 'react';

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
    <div style={{ padding: '2rem' }}>
      <h2>Leave a Review</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
        {/* ⭐ Star Rating */}
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Overall Rating:</label>
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
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
              style={{
                fontSize: '2rem',
                color: (hover || rating) >= star ? '#ffc107' : '#ccc',
                cursor: 'pointer',
                marginRight: '0.3rem'
              }}
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
          style={{ width: '100%', marginBottom: '1rem' }}
        />

        {/* Questions */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Was the item as described?</label><br />
          <label>
            <input
              type="radio"
              name="descriptionMatch"
              value="Yes"
              onChange={handleQuestionChange}
              required
            /> Yes
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              name="descriptionMatch"
              value="No"
              onChange={handleQuestionChange}
            /> No
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>How was the shipping experience?</label><br />
          <label>
            <input
              type="radio"
              name="shippingExperience"
              value="Excellent"
              onChange={handleQuestionChange}
              required
            /> Excellent
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              name="shippingExperience"
              value="Okay"
              onChange={handleQuestionChange}
            /> Okay
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              name="shippingExperience"
              value="Poor"
              onChange={handleQuestionChange}
            /> Poor
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Would you buy from this seller again?</label><br />
          <label>
            <input
              type="radio"
              name="buyAgain"
              value="Yes"
              onChange={handleQuestionChange}
              required
            /> Yes
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              name="buyAgain"
              value="No"
              onChange={handleQuestionChange}
            /> No
          </label>
        </div>

        {/* Submit */}
        <button type="submit" style={{ marginTop: '1rem' }}>Submit Review</button>
      </form>
    </div>
  );
};

export default Review;