import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./landingPage.css";

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register form

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission (either login or register)
    // You can connect this with the backend for authentication
  };

  return (
    <div className="landing-page-container">
      <h1>Welcome to Task Manager</h1>
      
      {/* Login/Register Toggle */}
      <div className="form-toggle">
        <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Login</button>
        <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Register</button>
      </div>

      {/* Login/Register Form */}
      <form onSubmit={handleFormSubmit} className="auth-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        {!isLogin && <input type="text" placeholder="Username" required />} {/* Only show for Register */}
        
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>


    </div>
  );
};

export default LandingPage;
