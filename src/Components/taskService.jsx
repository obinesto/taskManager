import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://backendtaskmanager-8r4n.onrender.com/api'
});

// Automatically include the token in all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or your token storage logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
