import { createContext, useState, useEffect } from 'react';
// Import the helper functions we just built in api.js
import { AppState, loginUser, logoutUser, registerUser } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check local storage when the app first loads
  useEffect(() => {
    const storedUser = AppState.getUser();
    if (storedUser && storedUser.id && storedUser.role) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(storedUser);
    }
    setIsInitializing(false);
  }, []);

  const login = async (email, password, expectedRole) => {
    try {
      // 1. Call the loginUser function from api.js (which checks db.json)
      const response = await loginUser(email, password);
      
      // 2. If it succeeds, set the user in global state
      if (response.success) {
        if (expectedRole && response.user.role !== expectedRole) {
          AppState.clearSession();
          return { success: false, message: 'This account does not have access to this login.' };
        }
        setUser(response.user);
        return { success: true, user: response.user };
      } 
      
      // 3. If it fails (wrong password/email), pass the error message back to the UI
      return { success: false, message: response.message };
      
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "An unexpected error occurred." };
    }
  };

  const register = async (userData) => {
    const response = await registerUser(userData);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    logoutUser(); // Clears localStorage via api.js
    setUser(null); // Clears the React state
  };

  return (
    <AuthContext.Provider value={{ user, isInitializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};