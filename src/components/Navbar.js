import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/NavBar.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; 
import moment from 'moment'; 

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate(); 
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigateToCurrentMonthReviews = () => {
    const currentMonth = moment().format('MMMM'); 
    navigate(`/book-page?month=${currentMonth}`);
  };

  return (
    <nav className="navbar">
    
      <Link to="/" className="navbar-item">
        <FontAwesomeIcon icon={faHome} className="nav-icon" />
        Home
      </Link>

      <div className="navbar-center">
  <Link to="/book-page" className="navbar-item">All Books</Link>
  <Link 
    to="#" 
    onClick={(e) => {
      e.preventDefault(); // Prevent default anchor behavior
      handleNavigateToCurrentMonthReviews();
    }} 
    className="navbar-item"
  >
    This Month's Reviews
  </Link>
  <Link to="/about-us" className="navbar-item">
    <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
    About Us
  </Link>
</div>




      <div className="navbar-right">
        {currentUser ? (
          <>

            <Link to="/profile" className="navbar-item">
              <FontAwesomeIcon icon={faUser} className="nav-icon" />
              My Profile
            </Link>
            <button onClick={handleLogout} className="navbar-button">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Log In</Link>
            <Link to="/signup" className="navbar-item">Sign Up</Link>
          </>
        )}

      </div>
    </nav>
  );
};

export default NavBar;
