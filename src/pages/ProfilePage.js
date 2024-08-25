import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import '../style/ProfilePage.css';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [nickname, setNickname] = useState('');
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

    const fetchUserNickname = async () => {
      try {
        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc); // Use getDoc
        if (userSnapshot.exists()) {
          setNickname(userSnapshot.data().nickname);
        }
      } catch (error) {
        console.error('Error fetching user nickname:', error);
      }
    };

    fetchUserReviews();
    fetchUserNickname();
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
  
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <i
            key={i}
            className="fa fa-star"
            aria-hidden="true"
          />
        );
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(
          <i
            key={i}
            className="fa fa-star-half-o"
            aria-hidden="true"
          />
        );
      } else {
        stars.push(
          <i
            key={i}
            className="fa fa-star empty"
            aria-hidden="true"
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="profile-page">
      <h1>{nickname ? `${nickname}` : 'My Profile'}</h1>
      <h2>Past Written Reviews</h2>
      <ul className="review-list">
        {reviews.map(review => (
          <li key={review.id} className="review-item">
            {editingReviewId === review.id ? (
              <div className="edit-review">
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
                <p className="review-rating">Rating: {renderStars(review.rating)}</p>
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
