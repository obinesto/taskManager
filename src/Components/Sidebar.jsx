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
    <div className="w-48 bg-gradient-to-l from-indigo-900 to-blue-800 text-white p-6 flex flex-col justify-between shadow-lg">
      {isAuthenticated ? (
        <div className="flex flex-col items-center">
          <MdAccountCircle className="md:size-10 sm:size-7" />
          {user && <h2 className="capitalize">welcome {user.username}</h2>}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <MdAccountCircle className="md:size-10 sm:size-7" />
          <h2>Welcome Guest</h2>
        </div>
      )}

      {/* Sidebar Header */}
      <div>
        <h2 className="text-2xl font-bold text-center">Task Manager</h2>

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
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Sidebar Footer */}
      <footer className="text-center text-sm text-gray-300">
        © 2024 Task Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default Sidebar;
