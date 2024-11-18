import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTachometerAlt, FaTasks } from 'react-icons/fa';
import { AuthContext } from './Utils/AuthContext';

const Sidebar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 bg-gradient-to-l from-indigo-900 to-blue-800 text-white p-6 flex flex-col justify-between shadow-lg">
      {/* Sidebar Header */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Task Manager</h2>

        {/* Navigation Links */}
        <ul className="space-y-4">
          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center py-2 px-4 rounded hover:bg-indigo-700 transition duration-200 ease-in-out"
                >
                  <FaTachometerAlt className="mr-3" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tasklist"
                  className="flex items-center py-2 px-4 rounded hover:bg-indigo-700 transition duration-200 ease-in-out"
                >
                  <FaTasks className="mr-3" />
                  <span>Task List</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center py-2 px-4 rounded hover:bg-red-600 transition duration-200 ease-in-out"
                >
                  <FaSignOutAlt className="mr-3" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/"
                className="flex items-center justify-center py-2 px-4 rounded bg-indigo-700 hover:bg-indigo-600 transition duration-200 ease-in-out"
              >
                Login/Register
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Sidebar Footer */}
      <footer className="text-center text-sm text-gray-300 mt-6">
        © 2024 Task Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default Sidebar;
