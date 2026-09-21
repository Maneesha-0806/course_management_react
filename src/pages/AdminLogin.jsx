import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Link as ChakraLink, Stack, Text } from '@chakra-ui/react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Pass 'admin' as the third parameter to enforce the role
    await login(email, password, 'admin');
    
    setIsLoading(false);
    navigate('/admin/dashboard');
  };

  return (
    <Container maxW="md" py={12}><Box bg="gray.800" rounded="lg" p={8} borderTopWidth="4px" borderColor="red.400"><Heading size="md" textAlign="center" mb={8} color="red.300">Faculty / Admin Login</Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={5}><FormControl isRequired><FormLabel>Institutional Email</FormLabel><Input 
              type="email" 
              placeholder="faculty@academiax.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              /></FormControl><FormControl isRequired><FormLabel>Password</FormLabel><Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              /></FormControl><Button type="submit" width="full" colorScheme="red" isDisabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Secure Login'}
          </Button></Stack>
        </form>
        <Stack textAlign="center" mt={6} spacing={2} fontSize="sm" color="gray.400"><Text>New Faculty? <ChakraLink as={Link} to="/admin/register" color="red.300">Register with Invite Code</ChakraLink></Text><Text>Forgot password? <ChakraLink as={Link} to="/forgot-password?role=admin" color="red.300">Reset here</ChakraLink></Text><Text borderTopWidth="1px" borderColor="whiteAlpha.200" pt={3}>Student? <ChakraLink as={Link} to="/login" color="brand.300">Go to Student Login</ChakraLink></Text></Stack>
      </Box></Container>
  );
};

export default AdminLogin;