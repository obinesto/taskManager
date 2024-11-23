import { useContext,useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaTachometerAlt, FaTasks } from "react-icons/fa";
import { AuthContext } from "./Utils/AuthContext";
import { MdAccountCircle } from "react-icons/md";
import axios from "./taskService";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me"); // Endpoint to get logged-in user details
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); // This runs once when the component mounts

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="card w-64 bg-gradient-to-l from-indigo-900 to-blue-800 text-white shadow-lg p-6 rounded-none">
      {/* User Info */}
      <div className="flex flex-col items-center mb-16">
        <MdAccountCircle className="text-4xl mb-2" />
        {isAuthenticated ? (
          <h2 className="capitalize">Welcome {user?.username}</h2>
        ) : (
          <h2>Welcome Guest</h2>
        )}
      </div>
  
      {/* Sidebar Header */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-10">Task Manager</h2>
  
        {/* Navigation Links */}
        <ul className="menu bg-transparent p-0 space-y-6">
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard" className="btn btn-outline btn-primary w-full flex items-center">
                  <FaTachometerAlt className="mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/tasklist" className="btn btn-outline btn-primary w-full flex items-center mb-64">
                  <FaTasks className="mr-3" />
                  Task List
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-error w-full flex items-center mb-64"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/" className="btn btn-primary w-full flex justify-center mb-96">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
  
      {/* Sidebar Footer */}
      <footer className="text-center text-sm text-gray-300 mt-4">
        © 2024 Task Manager. All rights reserved.
      </footer>
    </div>
  );  
};

export default Sidebar;
