import { useState, useEffect } from 'react';
import axios from './taskService';
import { Link } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('/tasks', { params: filter ? { status: filter } : {} });
      setTasks(response.data);
    };
    fetchTasks();
  }, [filter]);

  // Pagination calculation
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-indigo-600 mb-4">Task List</h1>
        <p className="text-xl text-gray-600 mb-6">Here is your task list!</p>

        {/* Add New Task Button */}
        <Link to="/add-task">
          <button className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-4">
            Add New Task
          </button>
        </Link>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label htmlFor="filter" className="block text-gray-700 font-medium mb-2">Filter by Status:</label>
          <select
            id="filter"
            className="border-gray-300 rounded-md p-2 w-full"
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
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Task Name</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 text-sm text-gray-700">{task.name}</td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    <span className={`px-3 py-1 rounded-full text-white ${task.status === 'Completed' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <Link to={`/task/${task._id}`}>
                      <button className="bg-indigo-600 text-white py-1 px-4 rounded-md hover:bg-indigo-700">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6">
          {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              disabled={currentPage === index + 1}
              className={`py-2 px-4 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-gray-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
