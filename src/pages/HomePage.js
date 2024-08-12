// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
//initalize variables
const HomePage = () => {
  const navigate = useNavigate();
//useNavigate
  const handleNavigateToBookPage = () => {
    navigate('/book-page'); 
  };
  const handleNavigateToLoginPage = () => {
    navigate('/login'); 
  };  const handleNavigateToSignUpPage = () => {
    navigate('/signup'); 
  };

  return (
    <div>
      <h1>Welcome to the Fantasy Book Blog!</h1>
      <p>Dive into the world of fantasy literature with us! At our blog, we bring you monthly reviews of the latest and greatest fantasy books, along with insightful critiques and recommendations. Whether you're a longtime fan or just starting your magical journey, our reviews will guide you to your next favorite read.

Don't miss out on any of our updates! Subscribe now to get the latest reviews, book news, and exclusive content delivered straight to your inbox. Join our community of book lovers and never miss a page!</p>
      <button onClick={handleNavigateToBookPage}>Read the Reviews</button>
      <button onClick={handleNavigateToSignUpPage}>Subscribe</button>
      <button onClick={handleNavigateToLoginPage}>Already subscribed? Login!</button>
    </div>
  );
};

export default HomePage;
