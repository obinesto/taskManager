import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { FaSignOutAlt } from 'react-icons/fa'; 
import { AuthContext } from './Utils/AuthContext'; 

const Sidebar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  return (
    <div className="sidebar w-64 bg-gradient-to-l from-indigo-800 to-blue-950 text-white p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center">Task Manager</h2>
      
      <ul className="space-y-4">
        {isAuthenticated ? (
          <>
            <li>
              <Link 
                to="/dashboard" 
                className="block py-2 px-4 rounded hover:bg-indigo-600 transition ease-in-out"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/tasklist" 
                className="block py-2 px-4 rounded hover:bg-indigo-600 transition ease-in-out"
              >
                Task List
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                className="w-full py-2 px-4 rounded hover:bg-red-600 transition ease-in-out flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link 
              to="/" 
              className="flex items-center justify-center py-2 px-2 rounded bg-indigo-950 hover:bg-indigo-600 transition ease-in-out"
            >
              Login/Register
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
