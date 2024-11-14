import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Utils/AuthContext'; // Import AuthContext


const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(false); // Toggle between login and register form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login } = useContext(AuthContext); // Get the login function from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:10000/api/auth/login', { email, password });
      if (data.token) {
        login(data.token); // Call the login function from context
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:10000/api/auth/register', { username, email, password });
      login(data.token); // Call the login function from context
      navigate('/dashboard');
    } catch (error) {
      console.error('Register Error:', error.response.data.message);
    }
  };

  return (
    <div className="auth-page-container">
      <h1>Welcome to Task Manager</h1>
      {isLogin ? (
        <form onSubmit={handleLogin} className="auth-form">
          <h3>Login</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p>Don&apos;t have an account? 
            <button type="button" onClick={() => setIsLogin(false)}>Register</button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="auth-form">
          <h3>Register</h3>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          <p>Already have an account? 
            <button type="button" onClick={() => setIsLogin(true)}>Login</button>
          </p>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
