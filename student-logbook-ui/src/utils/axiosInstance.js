// src/utils/axiosInstance.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;


const axiosInstance = axios.create({
  baseURL,
});

// Optional: Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
