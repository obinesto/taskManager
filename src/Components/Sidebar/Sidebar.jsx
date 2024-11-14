import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Task Manager</h2>
      <ul>
      <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/tasklist">Task List</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
