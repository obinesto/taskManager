import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { FaSignOutAlt } from 'react-icons/fa'; // Use React Icons for Logout
import { AuthContext } from './Utils/AuthContext'; // Import AuthContext


const Sidebar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext); // Access the authentication state
  const navigate = useNavigate(); // Get the navigate function from react-router


  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate('./'); // Redirect to login page after logout
  };

  return (
    <div className="sidebar">
      <h2>Task Manager</h2>
      <ul>
        {isAuthenticated ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/tasklist">Task List</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/">Login/Register</Link></li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;

