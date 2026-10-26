import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, Link, Alert, AlertIcon } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Call the new Express API via AuthContext
    const result = await login(email, password, 'student');

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading size="lg" mb={6} textAlign="center">Student Login</Heading>
      
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
            Log In
          </Button>
        </VStack>
      </form>
      
      <Text mt={4} textAlign="center">
        Need an account? <Link as={RouterLink} to="/register" color="blue.500">Register</Link>
      </Text>
    </Box>
  );
}

export default Login;