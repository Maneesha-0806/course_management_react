// src/services/api.js
import axios from "axios";

export const AppState = {
  getUser: () => JSON.parse(localStorage.getItem('user')),
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
    // This asks json-server: "Find an exact match for this email and password"
    const response = await api.get(`/users?email=${email}&password=${password}`);
    const matchedUsers = response.data;

    // If the array is empty, the user typed the wrong credentials
    if (matchedUsers.length === 0) {
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

export const logoutUser = () => {
  AppState.clearSession();
};

export default api;