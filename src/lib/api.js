import axios from 'axios';

/**
 * Centralized API Client
 * Configured with baseURL and JWT interceptors for automatic auth handling.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject JWT token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // We don't force a redirect here to avoid reload loops; 
      // the AuthContext will detect the missing token.
    }
    return Promise.reject(error);
  }
);

export default api;
