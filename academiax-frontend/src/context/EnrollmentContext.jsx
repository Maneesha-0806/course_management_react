import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

const EnrollmentContext = createContext(null);

export function EnrollmentProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Whenever the logged-in user changes, fetch their specific enrollments
  useEffect(() => {
    if (user && user.role === 'student') {
      // eslint-disable-next-line react-hooks/immutability
      fetchUserEnrollments(user.id);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEnrollments([]);
      setLoading(false);
    }
  }, [user]);

  async function fetchUserEnrollments(userId) {
    try {
      setLoading(true);
      // Queries json-server for enrollments matching the user's ID
      const response = await api.get('/enrollments', { params: { userId } });
      setEnrollments(response.data.filter((enrollment) => String(enrollment.userId) === String(userId)));
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setLoading(false);
    }
  }

  // We will use this function later when a student clicks "Enroll Now"
  async function enrollInCourse(courseId) {
    if (!user || user.role !== 'student') return null;

    const existingEnrollment = enrollments.find(
      (enrollment) => String(enrollment.courseId) === String(courseId)
    );
    if (existingEnrollment) return existingEnrollment;
    
    const newEnrollment = {
      userId: user.id,
      courseId: courseId,
      progress: 0,
      status: "Ongoing"
    };

    const response = await api.post("/enrollments", newEnrollment);
    setEnrollments((prev) => [...prev, response.data]);
    return response.data;
  }

  async function updateEnrollmentProgress(enrollmentId, newProgress) {
    try {
      const enrollment = enrollments.find((e) => e.id === enrollmentId);
      if (!enrollment) return;

      // If progress reaches 100, automatically mark the status as Completed
      const status = newProgress >= 100 ? "Completed" : "Ongoing";
      const updatedEnrollment = { ...enrollment, progress: newProgress, status };

      const response = await api.put(`/enrollments/${enrollmentId}`, updatedEnrollment);
      
      // Update global React state with the returned API data
      setEnrollments((prev) => 
        prev.map((e) => (e.id === enrollmentId ? response.data : e))
      );
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  }

  return (
      <EnrollmentContext.Provider value={{ enrollments, loading, enrollInCourse, updateEnrollmentProgress }}>
           {children}
      </EnrollmentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEnrollments() {
  return useContext(EnrollmentContext);
}