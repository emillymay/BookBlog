import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import BookPage from './pages/BookPage';
import BookDetailPage from './pages/BookDetailPage';
import PostReviewForm from './pages/PostReviewForm';
import ProfilePage from './pages/ProfilePage'; // Ensure to import the ProfilePage
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/book-page" element={<BookPage />} />
            <Route path="/bookdetail/:id" element={<BookDetailPage />} />
            <Route path="/post-review/:id" element={<PostReviewForm />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* Add this route if not added already */}
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
