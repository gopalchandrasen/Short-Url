import axios from 'axios';

const api = axios.create({
  // Vite proxy routes /api to localhost:8002 automatically
  baseURL: '/api'
});

// Add a request interceptor to attach the JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
