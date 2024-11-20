import React, { useState, useEffect } from 'react';
import axios from './taskService';
import { useNavigate } from 'react-router-dom';

const TaskForm = () => {
  const [task, setTask] = useState({ name: '', description: '', executedBySelf: true, assignedTo: '', assignedBy: '' });
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null); 
  const [error, setError] = useState(''); // To handle form submission errors
  const [loading, setLoading] = useState(false); // To handle loading state during task creation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not logged in');
        navigate('/login');
        return;
      }

      try {
        const usersResponse = await axios.get('/auth/users');
        setUsers(usersResponse.data);

        const userResponse = await axios.get('/auth/me');
        setLoggedInUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (loggedInUser && task.executedBySelf) {
      setTask((prevTask) => ({
        ...prevTask,
        assignedTo: loggedInUser.email,
        assignedBy: loggedInUser.email,
      }));
    }
  }, [task.executedBySelf, loggedInUser]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous errors

    try {
      await axios.post('/tasks', task);
      setTask({ name: '', description: '', executedBySelf: true, assignedTo: '' }); // Reset the form
      navigate('/tasklist');
    } catch (error) {
      setError('Error creating task. Please try again later.');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-center mb-6">Create Task</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>} {/* Display error message if any */}
        
        <input
          type="text"
          name="name"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="Task Name"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <textarea
          name="description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Task Description"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="executedBySelf"
            checked={task.executedBySelf}
            onChange={(e) => setTask({ ...task, executedBySelf: e.target.checked })}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Executed by Self</label>
        </div>
        
        {!task.executedBySelf && (
         <select
         className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
         value={task.assignedTo}
         onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
         placeholder="Assigned To"
         required
         >
         <option value="" disabled>
           Select a User
         </option>
         {users
           .filter((user) => loggedInUser && user.email !== loggedInUser.email)
           .map((user) => (
             <option key={user._id} value={user.email}>
               {user.username}
             </option>
           ))}
         </select>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white rounded-lg mt-4 ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'}`}
        >
          {loading ? 'Creating Task...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
