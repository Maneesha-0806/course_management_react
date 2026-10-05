import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Alert, Box, Button, Container, FormControl, FormLabel, Heading, Input, Link as ChakraLink, Select, Stack, Text } from '@chakra-ui/react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', department: 'Engineering', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await register({ ...formData, role: 'student' });
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <Container maxW="lg" py={12}><Box bg="gray.800" rounded="lg" p={8} shadow="lg">
        <Heading size="md" textAlign="center" mb={8}>Student Registration</Heading>
        {error && <Alert status="error" mb={5}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <FormControl isRequired><FormLabel htmlFor="register-name">Full Name</FormLabel><Input id="register-name" name="name" type="text" placeholder="Jane Doe" value={formData.name} onChange={handleChange} /></FormControl>
            <FormControl isRequired><FormLabel htmlFor="register-email">Email address</FormLabel><Input id="register-email" name="email" type="email" placeholder="jane@student.edu" value={formData.email} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel htmlFor="register-department">Department</FormLabel><Select id="register-department" name="department" value={formData.department} onChange={handleChange}>
              <option>Engineering</option>
              <option>Science</option>
              <option>Arts</option>
            </Select></FormControl>
            <FormControl isRequired><FormLabel htmlFor="register-password">Password</FormLabel><Input id="register-password" name="password" type="password" placeholder="At least 6 characters" minLength="6" value={formData.password} onChange={handleChange} /></FormControl>
            <Button type="submit" width="full" isDisabled={isLoading}>{isLoading ? 'Creating account...' : 'Register'}</Button>
          </Stack>
        </form>
        <Text textAlign="center" color="gray.400" mt={5}>Already registered? <ChakraLink as={Link} to="/login" color="brand.300">Log in</ChakraLink></Text>
      </Box></Container>
  );
};

export default Register;