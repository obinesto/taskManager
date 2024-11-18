import { useState } from 'react';
import axios from './taskService';
import { useNavigate } from 'react-router-dom';

const TaskForm = () => {
  const [task, setTask] = useState({ name: '', description: '', executedBySelf: true, assignedTo: '' });
  const [error, setError] = useState(''); // To handle form submission errors
  const [loading, setLoading] = useState(false); // To handle loading state during task creation
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

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
          onChange={handleChange}
          placeholder="Task Name"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <textarea
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="executedBySelf"
            checked={task.executedBySelf}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Executed by Self</label>
        </div>
        
        {!task.executedBySelf && (
          <input
            type="text"
            name="assignedTo"
            value={task.assignedTo}
            onChange={handleChange}
            placeholder="Assigned To"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
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
