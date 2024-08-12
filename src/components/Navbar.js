import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/book-page">View All Books</Link> 
      {currentUser ? (
        <>
          <Link to="/profile">My Profile</Link>
          <button onClick={handleLogout}>Sign Out</button>
        </>
      ) : (
        <>
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
