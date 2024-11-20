import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Utils/AuthContext';

const apiUrl = {
  login: import.meta.env.VITE_API_URL_LOGIN,
  register: import.meta.env.VITE_API_URL_REGISTER,
};

const AuthPage = ({ notify }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Access login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const apiEndpoint = isLogin ? apiUrl.login : apiUrl.register;
    const payload = isLogin
      ? { email, password }
      : { username, email, password };

    try {
      const { data } = await axios.post(apiEndpoint, payload);
      if (data.token) {
        login(data.token); // Log in user
        notify(isLogin ? 'Login successful' : 'Registration successful');
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
          Welcome to Task Manager
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold text-center">
            {isLogin ? 'Login' : 'Register'}
          </h3>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
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
            className={`w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
              loading && 'opacity-50 cursor-not-allowed'
            }`}
          >
            {loading
              ? isLogin
                ? 'Logging In...'
                : 'Registering...'
              : isLogin
              ? 'Login'
              : 'Register'}
          </button>
          <p className="text-center text-sm">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
