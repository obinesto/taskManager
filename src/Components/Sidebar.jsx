import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./Utils/AuthContext";
import axios from "./Utils/taskService";
import {LogOut, LayoutDashboard, CheckSquare, User, Menu, X, ChevronRight,} from "lucide-react";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
        console.error("Error fetching user:", error);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-md shadow-lg lg:hidden hover:bg-purple-700 transition duration-300"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white shadow-xl transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 bg-purple-800">
            <h2 className="text-2xl font-bold">TaskManager</h2>
          </div>

          <div className="flex-grow overflow-y-auto">
            <div className="px-4 py-6 border-b border-gray-700">
              <div className="flex items-center mb-3">
                <User className="w-5 md:w-8 h-10 text-purple-600" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-200">
                    {isAuthenticated
                      ? `Welcome, ${user?.username}`
                      : "Welcome, Guest"}
                  </h3>
                </div>
              </div>
            </div>

            <nav className="px-4 py-6 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      isActive("/dashboard")
                        ? "bg-purple-700 text-white"
                        : "text-gray-300 hover:bg-purple-700 hover:text-white"
                    }`}
                    to="/dashboard"
                  >
                    <LayoutDashboard className="mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      isActive("/tasklist")
                        ? "bg-purple-700 text-white"
                        : "text-gray-300 hover:bg-purple-700 hover:text-white"
                    }`}
                    to="/tasklist"
                  >
                    <CheckSquare className="mr-2" />
                    Task List
                  </Link>
                </>
              ) : (
                <Link
                  className="flex items-center p-2 rounded-lg text-gray-300 hover:bg-purple-700 hover:text-white transition-colors duration-300"
                  to="/"
                >
                  <ChevronRight className="mr-2 w-5 md:w-8 h-10 text-purple-600" />
                  Login
                </Link>
              )}
            </nav>
          </div>

          {isAuthenticated && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full p-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-200"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          )}

          <footer className="p-4 text-center text-xs text-gray-400 border-t border-gray-700">
            © {new Date().getFullYear()} TaskManager. All rights reserved.
          </footer>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
