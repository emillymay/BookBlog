import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/HomePage.css';
import moment from 'moment';

const bookCovers = [
  '/images/cover2.jpg',
  '/images/cover3.jpg',
  '/images/cover4.jpg',
  '/images/cover5.jpg',
  '/images/cover6.jpg',
  '/images/cover7.jpg',
  '/images/cover8.jpg',
  '/images/cover9.jpg',
];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bookCovers.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  const handleNavigateToBookPage = () => {
    navigate('/book-page');
  };

  const handleNavigateToLoginPage = () => {
    navigate('/login');
  };

  const handleNavigateToSignUpPage = () => {
    navigate('/signup');
  };

  const handleNavigateToCurrentMonthReviews = () => {
    const currentMonth = moment().format('MMMM'); 
    navigate(`/book-page?month=${currentMonth}`);
  };

  const getSlideClass = (index) => {
    const normalizedIndex = currentIndex % bookCovers.length;
    if (index === normalizedIndex) return 'carousel-item center';
    return 'carousel-item';
  };

  return (
    <div className="homepage">
      <div className="homepage-content">
        <img src='/images/openbook.png' alt='Open Book' className="homepage-logo" />
        <h1>Welcome to the Fantasy Book Blog!</h1>
        <p>
          Dive into the world of fantasy literature with us! At our blog, we bring you monthly reviews of the latest and greatest fantasy books, along with insightful critiques and recommendations. Whether you're a longtime fan or just starting your magical journey, our reviews will guide you to your next favorite read.
        
          Don't miss out on any of our updates! Subscribe now to get the latest reviews, book news, and exclusive content delivered straight to your inbox. Join our community of book lovers and never miss a page!
        </p>
        <div className="homepage-buttons">
          <button onClick={handleNavigateToCurrentMonthReviews}>This Month's Reviews</button>
          <button onClick={handleNavigateToBookPage}>Read the Reviews</button>
          <button onClick={handleNavigateToSignUpPage}>Subscribe</button>
          <button onClick={handleNavigateToLoginPage}>Already subscribed? Login!</button>
        </div>
      </div>
      <div className="book-carousel">
        <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * (100 / bookCovers.length)}%)` }}>
          {bookCovers.map((cover, index) => (
            <div key={index} className={getSlideClass(index)}>
              <img src={cover} alt={`Book Cover ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
