import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import ScrollToTop from './components/ScrollToTop';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <main style={{ minHeight: '100vh' }}>
          <Routes>
            {/* ... your routes remain exactly the same ... */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/enrollment-success" element={<EnrollmentSuccess />} />
            <Route path="/learning/:courseId" element={<CourseContent />} />
            <Route path="/materials" element={<CourseMaterials />} />
            <Route path="/learning/:courseId/video/:moduleId" element={<VideoPlayer />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/certificate/:courseId" element={<Certificate />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute requiredRole="admin">
                <AdminCourses />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/new" element={
              <ProtectedRoute requiredRole="admin">
                <CourseForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/:id/edit" element={
              <ProtectedRoute requiredRole="admin">
                <CourseForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/:id/roster" element={
              <ProtectedRoute requiredRole="admin">
                <CourseRoster />
              </ProtectedRoute>
            } />
            <Route path="/admin/assignments" element={
              <ProtectedRoute requiredRole="admin">
                <AdminAssignments />
              </ProtectedRoute>
            } />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;