import { createContext, useState, useEffect } from 'react';
// Import the helper functions we just built in api.js
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

  const login = async (email, password) => {
    try {
      // 1. Call the loginUser function from api.js (which checks db.json)
      const response = await loginUser(email, password);
      
      // 2. If it succeeds, set the user in global state
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } 
      
      // 3. If it fails (wrong password/email), pass the error message back to the UI
      return { success: false, message: response.message };
      
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "An unexpected error occurred." };
    }
  };

  const logout = () => {
    logoutUser(); // Clears localStorage via api.js
    setUser(null); // Clears the React state
  };

  return (
    <AuthContext.Provider value={{ user, isInitializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};