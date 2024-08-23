import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../style/BookPage.css';
import moment from 'moment';

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, 'books');
        let q = booksCollection;

        if (filterMonth) {
          q = query(booksCollection, where('reviewMonth', '==', filterMonth));
        }

        const booksSnapshot = await getDocs(q);
        let booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const reviewsCollection = collection(db, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsCollection);
        const reviewsList = reviewsSnapshot.docs.map(doc => doc.data());

        const calculateAverageRating = (bookId) => {
          const bookReviews = reviewsList.filter(review => review.bookId === bookId);
          const totalRating = bookReviews.reduce((acc, review) => acc + review.rating, 0);
          return bookReviews.length > 0 ? (totalRating / bookReviews.length).toFixed(1) : 0;
        };

        booksList = booksList.map(book => ({
          ...book,
          starRating: calculateAverageRating(book.id),
        }));

        if (searchQuery) {
          booksList = booksList.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (filterRating) {
          booksList = booksList.filter(book => book.starRating >= filterRating);
        }

        // Pagination
        const indexOfLastBook = currentPage * booksPerPage;
        const indexOfFirstBook = indexOfLastBook - booksPerPage;
        const currentBooks = booksList.slice(indexOfFirstBook, indexOfLastBook);

        setBooks(currentBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [filterMonth, searchQuery, filterRating, currentPage]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const month = searchParams.get('month');

    if (month) {
      setFilterMonth(month);
    }
  }, []);

  const handleNavigateToBookDetail = (id) => {
    navigate(`/bookdetail/${id}`);
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
    <div className="book-page">
      <h1>All Books</h1>
      <p>Explore a world of captivating stories and reviews from fellow readers. Stay updated with the latest reviews and never miss out on new book releases. Subscribe to our newsletter to receive exciting updates and exclusive content delivered straight to your inbox!</p>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setFilterMonth(e.target.value)} value={filterMonth}>
          <option value="">Filter by Month</option>
          {/* Options for months */}
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={moment().month(i).format('MMMM')}>
              {moment().month(i).format('MMMM YYYY')}
            </option>
          ))}
        </select>
        <select onChange={(e) => setFilterRating(e.target.value)} value={filterRating}>
          <option value="">Filter by Rating</option>
          {[1, 2, 3, 4, 5].map(rating => (
            <option key={rating} value={rating}>
              {rating} Star{rating > 1 ? 's' : ''} and up
            </option>
          ))}
        </select>
      </div>

      <ul className="book-list">
        {books.map(book => (
          <li key={book.id} className="book-item">
            <h2>{book.title}</h2>
            <p className="author">Author: {book.author}</p>
            <div className="rating-stars">
              {renderStars(book.starRating || 0)}
            </div>
            <p>{book.description}</p>
            <button onClick={() => handleNavigateToBookDetail(book.id)}>View Reviews</button>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={books.length < booksPerPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookPage;
