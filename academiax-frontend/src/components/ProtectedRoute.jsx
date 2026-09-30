import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isInitializing } = useContext(AuthContext);

  if (isInitializing) return <Center minH="50vh"><VStack><Spinner color="brand.300" size="lg" /><Text color="gray.400">Checking your session...</Text></VStack></Center>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;