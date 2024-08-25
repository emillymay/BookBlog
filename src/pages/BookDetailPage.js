import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import '../style/BookDetailPage.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookDoc = doc(db, 'books', id);
        const docSnap = await getDoc(bookDoc);

        if (docSnap.exists()) {
          setBook(docSnap.data());
        } else {
          console.error('No such book!');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('bookId', '==', id));
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchBook();
    fetchReviews();
  }, [id]);

  const handleBackClick = () => {
    navigate('/book-page');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      setError('You must be logged in to post a review.');
      return;
    }

    if (rating < 0 || rating > 5) {
      setError('Rating must be between 0 and 5.');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();
      const userNickname = userData.nickname || currentUser.displayName || currentUser.email;

      const newReview = {
        bookId: id,
        bookTitle: book?.title || '',
        author: book?.author || '',
        reviewText,
        rating,
        timestamp: Timestamp.fromDate(new Date()),
        userId: currentUser.uid,
        userName: userNickname,
      };

      await setDoc(doc(db, 'reviews', `${currentUser.uid}_${Date.now()}`), newReview);

      setReviews(prevReviews => [newReview, ...prevReviews]);

      const allRatings = [...reviews.map(review => review.rating), rating];
      const totalRating = allRatings.reduce((acc, r) => acc + r, 0);
      const updatedRating = totalRating / allRatings.length;
      const normalizedRating = Math.min(Math.max(updatedRating, 0), 5);

      await setDoc(doc(db, 'books', id), { starRating: normalizedRating }, { merge: true });

      setReviewText('');
      setRating(0);
      setError('');
    } catch (error) {
      console.error('Error posting review:', error);
      setError('Failed to post review');
    }
  };
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star"></i>); // Filled star
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>); // Half-filled star
      } else {
        stars.push(<i key={i} className="far fa-star"></i>); // Empty star
      }
    }
    return stars;
  };
  
  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <div className='book-detail-page'>
      <h1>{book.title} by {book.author}</h1>
      <p>{book.description}</p>
      <div className='rating-stars'>
        Rating: {book.starRating ? book.starRating.toFixed(1) : 'No rating yet'}
        <div>{renderStars(book.starRating || 0)}</div>
      </div>

      <h2>Reviews</h2>
      <div className='review-list'>
        {reviews.map(review => (
          <div key={review.id} className='review-item'>
            <p className="rating-stars">
              <strong>{review.userName}</strong> rated {renderStars(review.rating)}</p>
            <p>{review.reviewText}</p>
            <p><em>{new Date(review.timestamp.toDate()).toLocaleString()}</em></p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <label className='form-label' htmlFor='review-text'>Review</label>
        <textarea
          id='review-text'
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here"
          required
        />
        <label className='form-label' htmlFor='rating'>Star Rating</label>
        <input
          id='rating'
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="0"
          max="5"
          placeholder="Rating (0-5)"
          required
        />
        {error && <p className='error-message'>{error}</p>}
        <button type="submit">Post Review</button>
      </form>
      
      <button className='back-button' onClick={handleBackClick}>
        Back to Book Page
      </button>
    </div>
  );
};

export default BookDetailPage;
