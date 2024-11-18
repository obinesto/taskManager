import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Utils/AuthContext'; // Import AuthContext

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(''); // Track error message
  const { login } = useContext(AuthContext); // Get the login function from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request is made
    setError(''); // Reset previous errors

    try {
      const { data } = await axios.post('https://backendtaskmanager-8r4n.onrender.com/api/auth/login', { email, password });
      if (data.token) {
        login(data.token); // Call the login function from context
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request is made
    setError(''); // Reset previous errors

    try {
      const { data } = await axios.post('https://backendtaskmanager-8r4n.onrender.com/api/auth/register', { username, email, password });
      login(data.token); // Call the login function from context
      navigate('/dashboard');
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center text-indigo-600 mb-4">Welcome to Task Manager</h1>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}  {/* Error message */}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Login</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${loading && 'opacity-50 cursor-not-allowed'}`}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
            <p className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Register</h3>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${loading && 'opacity-50 cursor-not-allowed'}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="text-center text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
