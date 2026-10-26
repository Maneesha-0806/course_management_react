import axios from 'axios';

// Connect to the Express backend
const apiClient = axios.create({
  baseURL: 'http://localhost:5005/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Task 10: Intercept requests to attach the JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Grab the token we save during login
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;