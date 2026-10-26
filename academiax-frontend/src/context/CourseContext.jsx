import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient'; // Import the secure client

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // apiClient already knows the baseURL is http://localhost:5005/api/v1
      const response = await apiClient.get('/courses');
      setCourses(response.data.data); 
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses from the server.");
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData) => {
    try {
      const response = await apiClient.post('/courses', courseData);
      setCourses((prev) => [...prev, response.data.data]);
      return { success: true };
    } catch (err) {
      console.error("Error adding course:", err);
      return { success: false, message: "Failed to add course. Unauthorized." };
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const response = await apiClient.put(`/courses/${id}`, courseData);
      setCourses((prev) => prev.map((c) => (c.id === id ? response.data.data : c)));
      return { success: true };
    } catch (err) {
      console.error("Error updating course:", err);
      return { success: false, message: "Failed to update course." };
    }
  };

  const deleteCourse = async (id) => {
    try {
      await apiClient.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting course:", err);
      return { success: false, message: "Failed to delete course." };
    }
  };

  return (
    <CourseContext.Provider 
      value={{ courses, loading, error, fetchCourses, addCourse, updateCourse, deleteCourse }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCourses = () => useContext(CourseContext);