import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Initialize state variables   
const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const navigate = useNavigate();

  // Fetch all books
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

        if (searchQuery) {
          booksList = booksList.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setBooks(booksList);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [filterMonth, searchQuery]);

  const handleNavigateToBookDetail = (id) => {
    navigate(`/bookdetail/${id}`);
  };

  return (
    <div>
      <h1>All Books</h1>
      <p>Explore a world of captivating stories and reviews from fellow readers. Stay updated with the latest reviews and never miss out on new book releases. Subscribe to our newsletter to receive exciting updates and exclusive content delivered straight to your inbox!</p>

      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">Filter</option>
          {/* Add months as needed */}
          <option value="January">January 2024</option>
          <option value="February">February 2024</option>
          <option value="March">March 2024</option>
          <option value="April">April 2024</option>
          <option value="May">May 2024</option>
          <option value="June">June 2024</option>
          <option value="July">July 2024</option>
          <option value="August">August 2024</option>
          <option value="September">September 2024</option>
          <option value="October">October 2024</option>
          <option value="November">November 2024</option>
          <option value="December">December 2024</option>
        </select>
      </div>

      <ul>
        {books.map(book => (
          <li key={book.id}>
            <h2>{book.title}</h2>
            <p>Author: {book.author}</p>
           
            <p>Rating: {book.starRating !== undefined ? book.starRating.toFixed(1) : 'No rating yet'}</p>
            <p>{book.description}</p>
            <button onClick={() => handleNavigateToBookDetail(book.id)}>View Reviews</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookPage;

