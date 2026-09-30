import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Link as ChakraLink, Stack, Text } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. Bring in global state and routing hooks
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 2. Handle the button click
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    
    // Log in as a student
    await login(email, password, 'student');
    
    // 3. Force the redirect to the dashboard!
    navigate('/dashboard');
  };

  return (
    <Container maxW="md" py={12}>
      <Box bg="gray.800" borderTopWidth="4px" borderColor="brand.400" rounded="lg" p={8} shadow="lg">
        <Heading size="md" textAlign="center" color="brand.300" mb={8}>Student Login</Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <FormControl isRequired><FormLabel>Email Address</FormLabel><Input 
              type="email" 
              placeholder="student@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /></FormControl>
            <FormControl isRequired><FormLabel>Password</FormLabel><Input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /></FormControl>
            <Button type="submit" width="full">Secure Login</Button>
          </Stack>
        </form>
        <Stack textAlign="center" mt={6} spacing={2} fontSize="sm" color="gray.400">
          <Text>New Student? <ChakraLink as={Link} to="/register" color="brand.300">Create an Account</ChakraLink></Text>
          <Text>Forgot password? <ChakraLink as={Link} to="/forgot-password?role=student" color="brand.300">Reset here</ChakraLink></Text>
          <Text borderTopWidth="1px" borderColor="whiteAlpha.200" pt={3}>Faculty / Admin? <ChakraLink as={Link} to="/admin/login" color="red.300">Login here</ChakraLink></Text>
        </Stack>
      </Box>
    </Container>
  );
};

export default Login;