/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from '../utils/taskService';
import { useNavigate } from 'react-router-dom';
import BgImage from "../assets/bg-4.jpg";

const TaskForm = ({notify}) => {
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
  }, [navigate]);

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
      notify("Task created successfully", "success");
      setTask({ name: '', description: '', executedBySelf: true, assignedTo: '' }); // Reset the form
      navigate('/tasklist');
    } catch (error) {
      notify("Error creating task", "error");
      setError('Error creating task. Please try again later.');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 shadow-lg rounded-lg opacity-95 px-2 md:py-4 py-10"
    style={{
      backgroundImage: `url(${BgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <form onSubmit={handleSubmit} className='md:ml-72'>
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#764CE8] md:text-3xl">
          Create Task
        </h2>
        {error && <p className="text-[#E45858] text-sm mb-4">{error}</p>} {/* Display error message if any */}
  
        <input
          type="text"
          name="name"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="Task Name"
          required
          className="w-full p-3 mb-4 border border-[#4A4A63] bg-[#2B2B3D] text-[#FEFEFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#764CE8] placeholder-[#8888A6] md:p-4"
        />
  
        <textarea
          name="description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Task Description"
          className="w-full p-3 mb-4 border border-[#4A4A63] bg-[#2B2B3D] text-[#FEFEFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#764CE8] placeholder-[#8888A6] md:p-4"
        />
  
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="executedBySelf"
            checked={task.executedBySelf}
            onChange={(e) => setTask({ ...task, executedBySelf: e.target.checked })}
            className="mr-2 h-4 w-4 text-[#764CE8] bg-[#2B2B3D] border border-[#4A4A63] focus:ring-[#764CE8]"
          />
          <label className="text-sm text-[#2B2B3D] md:text-base">Executed by Self</label>
        </div>
  
        {!task.executedBySelf && (
          <select
            className="w-full p-3 mb-4 border border-[#4A4A63] bg-[#2B2B3D] text-[#FEFEFE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#764CE8] placeholder-[#8888A6] md:p-4"
            value={task.assignedTo}
            onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
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
          className={`w-full p-3 text-white rounded-lg mt-4 transition-colors duration-200 ${
            loading
              ? "bg-[#4A4A63] cursor-not-allowed"
              : "bg-[#30A46C] hover:bg-[#25805B] focus:outline-none focus:ring-2 focus:ring-[#30A46C]"
          } md:p-4`}
        >
          {loading ? "Creating Task..." : "Create Task"}
        </button>
      </form>
    </div>
  );  
};

export default TaskForm;
