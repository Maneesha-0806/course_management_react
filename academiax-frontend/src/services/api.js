// src/services/api.js
import axios from "axios";

export const AppState = {
  getUser: () => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  },
  setUser: (userData) => localStorage.setItem('user', JSON.stringify(userData)),
  setToken: (token) => localStorage.setItem('token', token),
  clearSession: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

// Define the axios instance first so it can be used by loginUser
const api = axios.create({
 baseURL: "http://localhost:5000"
});

// Update loginUser to actually check your db.json via the mock API
export const loginUser = async (email, password) => {
  try {
    const response = await api.get('/users', { params: { email } });
    const matchedUsers = response.data;

    if (matchedUsers.length === 0 || matchedUsers[0].password !== password) {
      return { success: false, message: "Invalid email or password." };
    }

    // If a match is found, grab the user data and save the session
    const user = matchedUsers[0];
    AppState.setUser(user);
    AppState.setToken('mock-jwt-token-12345'); // Keep the mock token logic for now
    
    return { success: true, user };
  } catch (error) {
    console.error("Server error during login:", error);
    return { success: false, message: "Server error. Please try again later." };
  }
};

export const registerUser = async (userData) => {
  try {
    const existingUsers = await api.get('/users', { params: { email: userData.email } });
    if (existingUsers.data.length > 0) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const response = await api.post('/users', userData);
    AppState.setUser(response.data);
    AppState.setToken('mock-jwt-token-12345');
    return { success: true, user: response.data };
  } catch (error) {
    console.error('Server error during registration:', error);
    return { success: false, message: 'Server error. Please try again later.' };
  }
};

export const logoutUser = () => {
  AppState.clearSession();
};

export default api;