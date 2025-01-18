import axios from 'axios';
import { store } from '../redux/store';

const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const instance = axios.create({
  baseURL: baseApiUrl,
  withCredentials: true, // Important for CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically include the token in all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle CORS-related errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.error('CORS error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;

