import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, Link, Alert, AlertIcon } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Call the new Express API via AuthContext
    const result = await register(formData);

    if (result.success) {
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading size="lg" mb={6} textAlign="center">Student Registration</Heading>
      
      {error && <Alert status="error" mb={4}><AlertIcon />{error}</Alert>}
      {success && <Alert status="success" mb={4}><AlertIcon />{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="student@example.com" />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" minLength={8} />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Department</FormLabel>
            <Input name="department" value={formData.department} onChange={handleChange} placeholder="Computer Science" />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
            Register
          </Button>
        </VStack>
      </form>
      
      <Text mt={4} textAlign="center">
        Already have an account? <Link as={RouterLink} to="/login" color="blue.500">Log In</Link>
      </Text>
    </Box>
  );
}

export default Register;