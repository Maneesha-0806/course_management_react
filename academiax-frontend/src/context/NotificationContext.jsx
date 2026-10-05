/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notifications when a student logs in
  useEffect(() => {
    if (user && user.role === 'student') {
      fetchNotifications(user.id);
    } else {
      setNotifications([]);
      setLoading(false);
    }
  }, [user]);

  const fetchNotifications = async (userId) => {
    try {
      setLoading(true);
      const response = await api.get(`/notifications?userId=${userId}`);
      setNotifications(response.data);
      setError('');
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setError('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      // Update the read status
      const updatedNotification = { ...notification, isRead: true };
      
      // Send the PUT request to db.json
      const response = await api.put(`/notifications/${id}`, updatedNotification);
      
      // Update global state with the response
      setNotifications(prev => prev.map(n => n.id === id ? response.data : n));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, error, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);