// src/services/api.js

export const AppState = {
  getUser: () => JSON.parse(localStorage.getItem('user')),
  setUser: (userData) => localStorage.setItem('user', JSON.stringify(userData)),
  setToken: (token) => localStorage.setItem('token', token),
  clearSession: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

export const loginUser = async (email, password, role = 'student') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = { username: email.split('@')[0], email, role };
      AppState.setUser(user);
      AppState.setToken('mock-jwt-token-12345');
      resolve({ success: true, user });
    }, 1500);
  });
};

export const logoutUser = () => {
  AppState.clearSession();
};