import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useTasks, useUsers, useUser } from "../hooks/useQueries";
import bgImage from "../assets/bg-2.jpg";

const TaskList = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const { data: user, isLoading: userLoading } = useUser();
  const { data: tasks, isLoading: tasksLoading } = useTasks(filter);
  const { data: users, isLoading: usersLoading } = useUsers();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const getUserNameByEmail = useMemo(() => {
    return (email) => {
      if (!users) return "Loading...";
      const foundUser = users.find((user) => user.email === email);
      return foundUser ? foundUser.username : email;
    };
  }, [users]);

  // Pagination calculation
  const currentTasks = useMemo(() => {
    if (!tasks) return [];
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    return tasks.slice(indexOfFirstTask, indexOfLastTask);
  }, [tasks, currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (userLoading || tasksLoading || usersLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div className="spinner w-16 h-16 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="text-[#764CE8] font-semibold text-3xl">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-2 md:py-4 py-10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-6xl bg-[#2B2B3D] p-4 sm:p-6 rounded-lg md:ml-72 shadow-md opacity-95">
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
        <Link to="/add-task">
          <button className="bg-[#764CE8] text-white py-2 px-4 sm:px-6 rounded-md hover:bg-[#5B3FBA] transition duration-200 mb-6 w-full sm:w-auto">
            Add New Task
          </button>
        </Link>
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
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-[#4A4A63] text-sm sm:text-base">
            <thead>
              <tr className="bg-[#2B2B3D] border-b border-[#4A4A63]">
                <th className="py-2 px-4 text-left font-bold text-[#C9C9C9]">
                  Task Name
                </th>
                <th className="py-2 px-4 text-left font-bold text-[#C9C9C9]">
                  Description
                </th>
                <th className="py-2 px-4 text-left font-bold text-[#C9C9C9]">
                  Assigned To
                </th>
                <th className="py-2 px-4 text-center font-bold text-[#C9C9C9]">
                  Status
                </th>
                <th className="py-2 px-4 text-left font-bold text-[#C9C9C9]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b border-[#4A4A63] hover:bg-[#2B2B3D]"
                >
                  <td className="py-2 px-4 text-[#D3D3D3]">{task.name}</td>
                  <td className="py-2 px-4 text-[#D3D3D3]">
                    {task.description}
                  </td>
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
        <div className="flex justify-center items-center mt-6 space-x-2">
          {tasks && Array.from(
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

