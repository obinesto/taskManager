import { useState, useEffect } from "react";
import axios from "./taskService";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg-2.jpg"

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null); // Store logged-in user details
  const [users, setUsers] = useState([]); // Store list of users
  const [loading, setLoading] = useState(false); // Loading state for preloader
  const tasksPerPage = 5;
  const navigate = useNavigate

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me"); // Endpoint to get logged-in user details
        setUser(response.data);
      } catch (error) {
        if(error.response.status === 401){
          navigate("/")
        }
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); // This runs once when the component mounts

  // Fetch all users (if necessary) for mapping assignedTo email to user name
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/auth/users"); // Endpoint to get all users (if not already available)
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // Runs once to fetch all users

  // Fetch tasks when the user is fetched and the filter changes
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        setLoading(true); // Set loading to true before making the request
        try {
          const response = await axios.get("/tasks", {
            params: filter ? { status: filter } : {},
          });
          const filteredTasks = response.data.filter(
            (task) =>
              task.assignedTo === user?.email || task.assignedBy === user?.email
          );
          setTasks(filteredTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        } finally {
          setLoading(false); // Set loading to false once the request is complete
        }
      };

      fetchTasks();
    }
  }, [filter, user]); // This runs when filter or user changes

  // Pagination calculation
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to get the username based on email (assignedTo)
  const getUserNameByEmail = (email) => {
    if (users.length === 0) return "Loading..."; // Fallback when users are not yet loaded
    const foundUser = users.find((user) => user.email === email);
    return foundUser ? foundUser.username : email; // Fallback to email if no user is found
  };

  if (loading)
    return (
      <p className="flex justify-center items-center min-h-screen text-[#764CE8] font-semibold text-xl sm:text-3xl">
        Loading...
      </p>
    );
  
  return (
    <div className="min-h-screen py-6 px-4"
    style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    }}>
      <div className="max-w-6xl mx-auto bg-[#2B2B3D] p-4 sm:p-6 rounded-lg shadow-md opacity-95">
        {user && (
          <h2 className="text-lg sm:text-xl font-medium text-[#C9C9C9] mb-2">
            Welcome back, {user.username}!
          </h2>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#764CE8] mb-4">
          Task List
        </h1>
        <p className="text-sm sm:text-lg text-[#D3D3D3] mb-4">
          Manage your tasks efficiently and stay organized.
        </p>
        {/* Add New Task Button */}
        <Link to="/add-task">
          <button className="bg-[#764CE8] text-white py-2 px-4 sm:px-6 rounded-md hover:bg-[#5B3FBA] transition duration-200 mb-6 w-full sm:w-auto">
            Add New Task
          </button>
        </Link>
        {/* Filter Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="filter"
            className="block text-sm sm:text-base text-[#C9C9C9] font-medium mb-2"
          >
            Filter by Status:
          </label>
          <select
            id="filter"
            className="border-[#4A4A63] bg-[#2B2B3D] text-[#FEFEFE] rounded-md p-2 w-full focus:ring-2 focus:ring-[#764CE8] focus:outline-none"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        {/* Task List Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-[#4A4A63] text-sm sm:text-base">
            <thead>
              <tr className="bg-[#2B2B3D] border-b border-[#4A4A63]">
                <th className="py-2 px-4 text-left font-bold text-[#C9C9C9]">Task Name</th>
                <th className="py-2 px-4 text-left font-bold text-[#C9C9C9]">Description</th>
                <th className="py-2 px-4 text-left font-bold text-[#C9C9C9]">Assigned To</th>
                <th className="py-2 px-4 text-center font-bold text-[#C9C9C9]">Status</th>
                <th className="py-2 px-4 text-left font-bold text-[#C9C9C9]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b border-[#4A4A63] hover:bg-[#2B2B3D]"
                >
                  <td className="py-2 px-4 text-[#D3D3D3]">{task.name}</td>
                  <td className="py-2 px-4 text-[#D3D3D3]">{task.description}</td>
                  <td className="py-2 px-4 text-[#D3D3D3]">
                    {getUserNameByEmail(task.assignedTo)}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white flex flex-col items-center text-center ${
                        task.status === "Completed"
                          ? "bg-green-500 hover:bg-green-600 transition duration-200"
                          : task.status === "In Progress"
                          ? "bg-blue-500 hover:bg-yellow-600 transition duration-200"
                          : task.status === "Rejected"
                          ? "bg-red-500 hover:bg-red-600 transition duration-200"
                          : "bg-yellow-500 hover:bg-gray-500 transition duration-200"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <Link to={`/task/${task._id}`}>
                      <button className="bg-[#764CE8] text-white py-1 px-3 text-xs rounded-full hover:bg-[#5B3FBA] transition duration-200 flex items-center">
                        <FaEye className="mr-2" /> View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          {Array.from(
            { length: Math.ceil(tasks.length / tasksPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                disabled={currentPage === index + 1}
                className={`py-2 px-3 rounded-md ${
                  currentPage === index + 1
                    ? "bg-[#764CE8] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition duration-200`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );  
};

export default TaskList;
