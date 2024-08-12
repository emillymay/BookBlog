import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookDetailPage = () => {
  const { id } = useParams(); // Get book details
  const { currentUser } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]); // Get reviews
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(''); // Error messages
  const navigate = useNavigate();

  // Fetch book details and reviews
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
      // Get the user's nickname from Firebase Authentication
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
        userName: userNickname, // Use nickname here
      };
  
      await setDoc(doc(db, 'reviews', `${currentUser.uid}_${Date.now()}`), newReview);

      setReviews(prevReviews => [newReview, ...prevReviews]);
      const allRatings = [...reviews.map(review => review.rating), rating];
      const totalRating = allRatings.reduce((acc, r) => acc + r, 0);
      const updatedRating = totalRating / allRatings.length; // Calculate the average rating

      const normalizedRating = Math.min(Math.max(updatedRating, 1), 5);

      // Update the book's rating
      await setDoc(doc(db, 'books', id), { starRating: normalizedRating }, { merge: true });

      setReviewText('');
      setRating(0);
      setError('');
    } catch (error) {
      console.error('Error posting review:', error);
      setError('Failed to post review');
    }
  };

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <div>
      <h1>{book.title} by {book.author}</h1>
      <p>{book.description}</p>
      <p>Rating: {book.starRating ? book.starRating.toFixed(1) : 'No rating yet'}</p>

      {error && <p>{error}</p>}
      <button onClick={handleBackClick} style={{ margin: '10px', padding: '10px' }}>
        Back to Book Page
      </button>
      <h2>Reviews</h2>
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <p><strong>{review.userName}</strong> rated {review.rating} stars:</p>
            <p>{review.reviewText}</p>
            <p><em>{new Date(review.timestamp.toDate()).toLocaleString()}</em></p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here"
          required
        />
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="0"
          max="5"
          placeholder="Rating (0-5)"
          required
        />
        <button type="submit">Post Review</button>
      </form>
    </div>
  );
};

export default BookDetailPage;
