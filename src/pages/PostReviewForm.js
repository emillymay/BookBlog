// src/pages/PostReviewForm.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const PostReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to post a review');
      navigate('/login');
      return;
    }
    try {
        const reviewsCollection = collection(db, 'books', id, 'reviews');
        await addDoc(reviewsCollection, {
          userId: currentUser.uid,
          author,
          title,
          date,
          reviewText,
          rating,
          createdAt: new Date(),
        });
        navigate(`/bookdetail/${id}`);
      } catch (error) {
        console.error('Error adding review:', error);
      }
    };
  
    return (
      <div>
        <h1>Post a Review</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Author:</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>
          <div>
            <label>Book Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label>Review:</label>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required />
          </div>
          <div>
            <label>Rating:</label>
            <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="0" max="5" required />
          </div>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    );
  };
  
  export default PostReviewForm;