import { useState, useEffect } from "react";
import axios from "./taskService";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null); // Store logged-in user details
  const [users, setUsers] = useState([]); // Store list of users
  const [loading, setLoading] = useState(false); // Loading state for preloader
  const tasksPerPage = 5;

  // Fetch logged-in user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/me'); // Endpoint to get logged-in user details
        setUser(response.data);
        console.log('User:', response.data); // Log user data
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []); // This runs once when the component mounts

  // Fetch all users (if necessary) for mapping assignedTo email to user name
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/auth/users'); // Endpoint to get all users (if not already available)
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
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
          const response = await axios.get('/tasks', { params: filter ? { status: filter } : {} });
          const filteredTasks = response.data.filter(
            (task) =>
              task.assignedTo === user?.email || task.assignedBy === user?.email
          );
          setTasks(filteredTasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
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
    if (users.length === 0) return 'Loading...'; // Fallback when users are not yet loaded
    const foundUser = users.find((user) => user.email === email);
    return foundUser ? foundUser.username : email; // Fallback to email if no user is found
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {user && <h2>Welcome back, {user.username}!</h2>} {/* Display user name */}
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Task List</h1>
        <p className="text-lg text-gray-600 mb-4">
          Manage your tasks efficiently and stay organized.
        </p>

        {/* Add New Task Button */}
        <Link to="/add-task">
          <button className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition duration-200 mb-6">
            Add New Task
          </button>
        </Link>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="filter"
            className="block text-gray-700 font-medium mb-2"
          >
            Filter by Status:
          </label>
          <select
            id="filter"
            className="border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                  Task Name
                </th>
                <th>Description</th> {/* New Column for Description */}
                <th>Assigned To</th> {/* New Column for Assigned To */}
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {task.name}
                  </td>
                  <td>{task.description}</td> {/* Display Description */}
                  <td>{getUserNameByEmail(task.assignedTo)}</td> {/* Display Name from Email */}
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full text-white ${task.status === "Completed"
                          ? "bg-green-500"
                          : task.status === "In Progress"
                            ? "bg-yellow-500"
                            : task.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-gray-400"
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <Link to={`/task/${task._id}`}>
                      <button className="bg-indigo-600 text-white py-1 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center">
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
        <div className="flex justify-center items-center mt-8">
          {Array.from(
            { length: Math.ceil(tasks.length / tasksPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                disabled={currentPage === index + 1}
                className={`py-2 px-4 mx-1 rounded-md ${currentPage === index + 1
                    ? "bg-indigo-600 text-white"
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
