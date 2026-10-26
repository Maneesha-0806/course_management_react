/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Restore session from browser storage on load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitializing(false);
  }, []);

  const login = async (email, password, expectedRole) => {
    try {
      // Task 9: Call the new Express login API
      const response = await apiClient.post('/auth/login', { email, password });
      const { student, token } = response.data;
      
      // To keep your frontend routing happy, we append the requested role 
      // (Since Express currently treats everyone as a student)
      const userWithRole = { ...student, role: expectedRole || 'student' };

      // Task 10: Store the real JWT token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithRole));
      
      setUser(userWithRole);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Check your credentials.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // Task 9: Call the new Express register API
      await apiClient.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      console.error("Registration Error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed.' 
      };
    }
  };

  const logout = () => {
    // Task 10: Implement logout functionality
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isInitializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);