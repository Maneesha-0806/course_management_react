import { createContext, useState, useEffect } from 'react';
import { AppState, loginUser, logoutUser } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check local storage when the app first loads
  useEffect(() => {
    const storedUser = AppState.getUser();
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(storedUser);
    }
    setIsInitializing(false);
  }, []);

  // Find this function inside AuthContext.jsx and update it:
  const login = async (email, password, role = 'student') => {
  // Pass the role to the simulated api.js function
    const response = await loginUser(email, password, role);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isInitializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};