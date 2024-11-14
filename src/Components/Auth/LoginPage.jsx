import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Add this import
import './authPage.css'; // Add styling for login page

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission (either login or register)
    // You can connect this with the backend for authentication
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Here you can handle the actual login API call
    // For now, just set the 'isLoggedIn' flag to true as if login was successful
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard'); // Redirect to dashboard after successful login
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Here you can handle the actual register API call
    // For now, just set the 'isLoggedIn' flag to true as if registration was successful
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/dashboard'); // Redirect to dashboard after successful registration
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear the login status
    window.location.href = '/'; // Redirect to the home page
  };


  return (
<div className="auth-page-container">
      <h1>Welcome to Task Manager</h1>
      {isLogin ? (
        <form onSubmit={handleLogin} className="auth-form">
          <h3>Login</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p>Don't have an account? 
            <button type="button" onClick={() => setIsLogin(false)}>Register</button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="auth-form">
          <h3>Register</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          <p>Already have an account? 
            <button type="button" onClick={() => setIsLogin(true)}>Login</button>
          </p>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
