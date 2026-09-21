import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Alert, Box, Button, Container, FormControl, FormLabel, Heading, Input, Link as ChakraLink, Stack, Text } from '@chakra-ui/react';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext); // Simulating register+login flow
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation check for institutional email requirement
    if (!email.endsWith('@academiax.edu')) {
      setError('Administrator registration requires a valid @academiax.edu email address.');
      return;
    }

    // Mock invite code validation
    if (inviteCode !== 'FACULTY2026') {
      setError('Invalid invite code. Contact IT support for access.');
      return;
    }

    // Trigger simulated authentication and redirect
    await login(email, password, 'admin');
    navigate('/admin/dashboard');
  };

  return (
    <Container maxW="lg" py={12}><Box bg="gray.800" rounded="lg" p={8} borderTopWidth="4px" borderColor="red.400"><Heading size="md" textAlign="center" mb={8} color="red.300">Faculty Registration</Heading>
        
        {error && (
          <Alert status="error" mb={5}>{error}</Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={5}><FormControl isRequired><FormLabel>Full Name</FormLabel><Input type="text" value={name} onChange={(e) => setName(e.target.value)} /></FormControl><FormControl isRequired><FormLabel>Institutional Email</FormLabel><Input type="email" placeholder="name@academiax.edu" value={email} onChange={(e) => setEmail(e.target.value)} /></FormControl><FormControl isRequired><FormLabel>Invite Code</FormLabel><Input type="text" placeholder="Provided by department head" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} /></FormControl><FormControl isRequired><FormLabel>Password</FormLabel><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></FormControl><Button type="submit" width="full" colorScheme="red">Register as Faculty</Button></Stack>
        </form>
        <Text textAlign="center" color="gray.400" mt={5} fontSize="sm">Already registered? <ChakraLink as={Link} to="/admin/login" color="red.300">Login here</ChakraLink></Text>
      </Box></Container>
  );
};

export default AdminRegister;