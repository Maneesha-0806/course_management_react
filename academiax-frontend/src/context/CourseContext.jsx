import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CourseContext = createContext(null);

// Create a specific Axios instance for the Express backend
const expressApi = axios.create({ baseURL: "http://localhost:5005" });

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses when the app loads
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await expressApi.get('/api/v1/courses');
      // Express nests the array inside response.data.data
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
      const response = await expressApi.post('/api/v1/courses', courseData);
      setCourses((prev) => [...prev, response.data.data]);
      return { success: true };
    } catch (err) {
      console.error("Error adding course:", err);
      return { success: false, message: "Failed to add course." };
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const response = await expressApi.put(`/api/v1/courses/${id}`, courseData);
      setCourses((prev) => prev.map((c) => (c.id === id ? response.data.data : c)));
      return { success: true };
    } catch (err) {
      console.error("Error updating course:", err);
      return { success: false, message: "Failed to update course." };
    }
  };

  const deleteCourse = async (id) => {
    try {
      await expressApi.delete(`/api/v1/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting course:", err);
      return { success: false, message: "Failed to delete course." };
    }
  };

  return (
    <CourseContext.Provider 
      value={{ 
        courses, 
        loading, 
        error, 
        fetchCourses, 
        addCourse, 
        updateCourse, 
        deleteCourse 
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCourses = () => useContext(CourseContext);