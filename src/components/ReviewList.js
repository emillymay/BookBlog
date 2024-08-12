// src/components/ReviewList.js
import React from 'react';

const ReviewList = ({ reviews, onDeleteReview, currentUser }) => {
  return (
    <div>
      {reviews.map(review => (
        <div key={review.id}>
          <p>{review.reviewText}</p>
          {currentUser && (currentUser.uid === review.userId || currentUser.isAdmin) && (
            <button onClick={() => onDeleteReview(review.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
