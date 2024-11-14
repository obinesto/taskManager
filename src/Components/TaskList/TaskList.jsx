import React, { useState, useEffect } from 'react';
import axios from '../../Services/taskService';
import { Link } from 'react-router-dom';
import "./tasklist.css";

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
    <div className="task-list-container">
      <h1>Tasks</h1>
      <p>Here is your task list!</p>

      {/* Add New Task Button */}
      <Link to="/add-task">
        <button className="add-task-button">Add New Task</button>
      </Link>

      {/* Filter Dropdown */}
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* Task List Table */}
      <table className="task-list-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => (
            <tr key={task._id}>
              <td>{task.name}</td>
              <td>
                <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </td>
              <td>
                {/* Action Buttons for each task */}
                <Link to={`/task/${task._id}`}>
                  <button className="view-task-button">View</button>
                </Link>
                {/* Additional action buttons based on task status */}
                {task.executedBySelf ? (
                  task.status === 'In Progress' && (
                    <button className="mark-completed-button">Mark as Completed</button>
                  )
                ) : (
                  <>
                    {task.status === 'Pending' && (
                      <>
                        <button className="accept-task-button">Accept</button>
                        <button className="reject-task-button">Reject</button>
                      </>
                    )}
                    {task.status === 'In Progress' && (
                      <button className="mark-completed-button">Mark as Completed</button>
                    )}
                  </>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="task-list-pagination">
        {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)} disabled={currentPage === index + 1}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
