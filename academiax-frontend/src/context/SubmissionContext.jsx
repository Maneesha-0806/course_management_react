/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

const SubmissionContext = createContext(null);

export const SubmissionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the correct submissions based on the logged-in user's role
  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        // Note: Our db.json tracks students by their string name for submissions
        fetchStudentSubmissions(user.name);
      } else if (user.role === 'admin') {
        fetchAllSubmissions();
      }
    } else {
      setSubmissions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchStudentSubmissions = async (studentName) => {
    try {
      setLoading(true);
      const response = await api.get(`/submissions?student=${studentName}`);
      setSubmissions(response.data);
      setError('');
    } catch (error) {
      console.error("Failed to fetch student submissions:", error);
      setError('Unable to load your submissions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/submissions');
      setSubmissions(response.data);
      setError('');
    } catch (error) {
      console.error("Failed to fetch all submissions:", error);
      setError('Unable to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  const addSubmission = async (newSubmission) => {
    try {
      const response = await api.post('/submissions', newSubmission);
      setSubmissions((prev) => [...prev, response.data]);
      return { success: true };
    } catch (error) {
      console.error("Failed to add submission:", error);
      return { success: false, message: "Unable to submit assignment." };
    }
  };

  // We will use this function in the next phase for AdminAssignments.jsx
  const gradeSubmission = async (id, updatedData) => {
    try {
      const response = await api.put(`/submissions/${id}`, updatedData);
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? response.data : sub))
      );
      return { success: true };
    } catch (error) {
      console.error("Failed to grade submission:", error);
      return { success: false };
    }
  };

  return (
    <SubmissionContext.Provider 
      value={{ 
        submissions, 
        loading,
        error,
        addSubmission, 
        gradeSubmission 
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmissions = () => useContext(SubmissionContext);