import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReviewText, setEditedReviewText] = useState('');
  const [editedRating, setEditedRating] = useState(0);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const reviewsCollection = collection(db, 'reviews');
        const q = query(reviewsCollection, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const userReviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(userReviews);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };

    fetchUserReviews();
  }, [currentUser.uid]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditedReviewText(review.reviewText);
    setEditedRating(review.rating);
  };

  const handleSaveEditedReview = async (reviewId) => {
    try {
      const reviewDoc = doc(db, 'reviews', reviewId);
      await updateDoc(reviewDoc, {
        reviewText: editedReviewText,
        rating: editedRating
      });

      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, reviewText: editedReviewText, rating: editedRating } : review
      ));

      setEditingReviewId(null);
      setEditedReviewText('');
      setEditedRating(0);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <div>
      <h1>Your Profile</h1>
      <h2>Your Reviews</h2>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            {editingReviewId === review.id ? (
              <div>
                <input
                  type="text"
                  value={editedReviewText}
                  onChange={(e) => setEditedReviewText(e.target.value)}
                />
                <input
                  type="number"
                  value={editedRating}
                  onChange={(e) => setEditedRating(Number(e.target.value))}
                  min="0"
                  max="5"
                />
                <button onClick={() => handleSaveEditedReview(review.id)}>Save</button>
              </div>
            ) : (
              <div>
                <h3>{review.bookTitle}</h3> 
                <p>{review.reviewText}</p>
                <p>Rating: {review.rating}/5</p>
                <button onClick={() => handleEditReview(review)}>Edit</button>
                <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
