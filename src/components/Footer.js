import React from 'react';
import '../style/Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about-us">About Us</a>
        
        </div>

        <div className="footer-info">
          <p>&copy; 2024 Fantasy Book Blog. All rights reserved.</p>
          <p>123 Book Lane, Fiction City, BC 12345</p>
          <p>Email: contact@fantasybookblog.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
