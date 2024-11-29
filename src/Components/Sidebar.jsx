import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaTachometerAlt, FaTasks } from "react-icons/fa";
import { AuthContext } from "./Utils/AuthContext";
import { MdAccountCircle, MdDehaze, MdCancel } from "react-icons/md";
import axios from "./taskService";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login")
        }
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-[#764CE8] text-white p-2 rounded-md shadow-lg lg920:hidden hover:bg-[#6A6A71] transition duration-300"
      >
        {isSidebarOpen ? <MdCancel size={24} /> : <MdDehaze size={24} />}
      </button>
  
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gradient-to-l from-[#171718] to-[#252525] text-[#F8F8F9] shadow-xl p-6 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg920:static lg920:translate-x-0 lg920:w-2/4 lg:w-full`}
      >
        {/* User Info */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <MdAccountCircle className="text-4xl md:text-5xl mb-2 text-[#C9C9C9]" />
          {isAuthenticated ? (
            <h2 className="text-base md:text-lg capitalize text-[#FEFEFE]">
              Welcome {user?.username}
            </h2>
          ) : (
            <h2 className="text-base md:text-lg text-[#FEFEFE]">Welcome Guest</h2>
          )}
        </div>
  
        {/* Sidebar Header */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-[#F8F8F9]">
            Task Manager
          </h2>
  
          {/* Navigation Links */}
          <ul className="menu bg-transparent p-0 space-y-4">
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="btn bg-transparent text-[#764CE8] border border-[#764CE8] w-full flex items-center justify-center md:justify-start hover:bg-[#764CE8] hover:text-[#F8F8F9] transition duration-300"
                  >
                    <FaTachometerAlt className="mr-2 md:mr-3" />
                    <span className="text-sm md:text-base">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tasklist"
                    className="btn bg-transparent text-[#764CE8] border border-[#764CE8] w-full flex items-center justify-center md:justify-start hover:bg-[#764CE8] hover:text-[#F8F8F9] transition duration-300"
                  >
                    <FaTasks className="mr-2 md:mr-3" />
                    <span className="text-sm md:text-base">Task List</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn bg-transparent text-[#E45858] border border-[#E45858] w-full flex items-center justify-center md:justify-start hover:bg-[#E45858] hover:text-[#F8F8F9] transition duration-300"
                  >
                    <FaSignOutAlt className="mr-2 md:mr-3" />
                    <span className="text-sm md:text-base">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/"
                  className="btn bg-[#764CE8] text-[#F8F8F9] w-full flex justify-center hover:bg-[#6A6A71] transition duration-300"
                >
                  <span className="text-sm md:text-base">Login</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
  
        {/* Sidebar Footer */}
        <footer className="text-center text-xs md:text-sm text-[#C9C9C9] mt-4">
          © 2024 Task Manager. All rights reserved.
        </footer>
      </div>
    </div>
  );  
};

export default Sidebar;
