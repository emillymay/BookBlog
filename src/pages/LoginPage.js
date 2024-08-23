import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../style/Login.css'; // Import the CSS file

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile'); // Direct to the profile page upon successful login
    } catch (err) {
      let errorMessage = 'An error occurred, please try again.';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'The email address is badly formatted.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'The password is incorrect.';
          break;
        case 'auth/missing-email':
          errorMessage = 'Please enter your email address.';
          break;
        case 'auth/missing-password':
          errorMessage = 'Please enter your password.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again.';
          break;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
