import axios from 'axios';
const baseApiUrl = import.meta.env.VITE_BASE_API_URL

const instance = axios.create({
  baseURL: baseApiUrl
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
