import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/NavBar.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Example icons

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
    <nav className="navbar">
      {/* Home Link with Icon */}
      <Link to="/" className="navbar-item">
        <FontAwesomeIcon icon={faHome} className="nav-icon" />
        Home
      </Link>

      {/* Center Links */}
      <div className="navbar-center">
        <Link to="/book-page" className="navbar-item">All Books</Link>
        <Link to="/book-page?month=August" className="navbar-item">This Month's Reviews</Link> {/* Link to current month's reviews */}
        <Link to="/about-us" className="navbar-item">
          <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
          About Us
        </Link>
      </div>

      {/* Right Side - Profile, About Us, Log In/Sign Out */}
      <div className="navbar-right">
        {currentUser ? (
          <>
            {/* Profile Link with Icon */}
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

        {/* About Us Link with Icon */}
       
      </div>
    </nav>
  );
};

export default NavBar;
