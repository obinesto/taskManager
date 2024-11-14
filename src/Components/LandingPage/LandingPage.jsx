import React from 'react';
import { Link } from 'react-router-dom';
import './landingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <h1>Welcome to Task Manager</h1>
      <p>Organize your work and life, finally.</p>
      <div className="cta-buttons">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default LandingPage;
