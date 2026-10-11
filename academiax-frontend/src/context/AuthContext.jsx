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
      setUser(storedUser);
    } else {
      AppState.clearSession();
    }
    setIsInitializing(false);
  }, []);

  const login = async (email, password, expectedRole) => {
    try {
      const response = await loginUser(email, password);

      if (response.success) {
        const authenticatedUser = response.user;
        const userRole = authenticatedUser?.role;

        if (expectedRole && userRole && userRole !== expectedRole) {
          AppState.clearSession();
          setUser(null);
          return { success: false, message: 'This account does not have access to this login.' };
        }

        if (!userRole) {
          AppState.clearSession();
          setUser(null);
          return { success: false, message: 'Unable to determine account access.' };
        }

        setUser(authenticatedUser);
        return { success: true, user: authenticatedUser };
      }

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