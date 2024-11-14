import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn'); // Check if user is logged in

  return (
    <div className="sidebar">
      <h2>Task Manager</h2>
      <ul>
        {/* Show links only if user is logged in */}
        {isLoggedIn ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/tasklist">Task List</Link></li>
          </>
        ) : (
          // Show login/register options when not logged in
          <li><Link to="/login">Login/Register</Link></li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;

