import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../style/SignUpPage.css'; // Import the CSS file

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        nickname,
        email,
      });

      // Set success state
      setSuccess(true);
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      {success ? (
        <div className="success-message">
          <h1>You are now Subscribed!</h1>
          <p>Continue Logging In?</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSignUp}>
            <h1>Sign Up</h1>
            <label>
              First Name:
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </label>
            <label>
              Last Name:
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </label>
            <label>
              Nickname:
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
            </label>
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Sign Up</button>
            {error && <p>{error}</p>}
          </form>

          <div className="faux-message">
           
            <h2>Wanna become a member?</h2>
            <p>
              Sign up to be sent monthly reviews and get notifications when fellow readers post a review! 
              You'll also get access to exclusive content, recommendations, and more...
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SignUpPage;
