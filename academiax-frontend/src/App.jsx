import { Routes, Route } from 'react-router-dom';

// Import Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import EnrollmentSuccess from './pages/EnrollmentSuccess';
import VideoPlayer from './pages/VideoPlayer';
import CourseContent from './pages/CourseContent';
import CourseMaterials from './pages/CourseMaterials';
import MyCourses from './pages/MyCourses';
import Assignments from './pages/Assignments';
import Notifications from './pages/Notifications';
import Certificate from './pages/Certificate';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import CourseForm from './pages/CourseForm';
import CourseRoster from './pages/CourseRoster';
import AdminAssignments from './pages/AdminAssignments';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <Routes>
          {/* =======================
              PUBLIC ROUTES 
          ======================== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* =======================
              PROTECTED STUDENT ROUTES 
          ======================== */}
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><Dashboard /></ProtectedRoute>} />
          <Route path="/enrollment-success" element={<ProtectedRoute requiredRole="student"><EnrollmentSuccess /></ProtectedRoute>} />
          <Route path="/learning/:courseId" element={<ProtectedRoute requiredRole="student"><CourseContent /></ProtectedRoute>} />
          <Route path="/materials" element={<ProtectedRoute requiredRole="student"><CourseMaterials /></ProtectedRoute>} />
          <Route path="/learning/:courseId/video/:moduleId" element={<ProtectedRoute requiredRole="student"><VideoPlayer /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute requiredRole="student"><MyCourses /></ProtectedRoute>} />
          <Route path="/assignments" element={<ProtectedRoute requiredRole="student"><Assignments /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute requiredRole="student"><Notifications /></ProtectedRoute>} />
          <Route path="/certificate/:courseId" element={<ProtectedRoute requiredRole="student"><Certificate /></ProtectedRoute>} />

          {/* =======================
              PROTECTED ADMIN ROUTES 
          ======================== */}
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute requiredRole="admin"><AdminCourses /></ProtectedRoute>} />
          <Route path="/admin/courses/new" element={<ProtectedRoute requiredRole="admin"><CourseForm /></ProtectedRoute>} />
          <Route path="/admin/courses/:id/edit" element={<ProtectedRoute requiredRole="admin"><CourseForm /></ProtectedRoute>} />
          <Route path="/admin/courses/:id/roster" element={<ProtectedRoute requiredRole="admin"><CourseRoster /></ProtectedRoute>} />
          <Route path="/admin/assignments" element={<ProtectedRoute requiredRole="admin"><AdminAssignments /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;