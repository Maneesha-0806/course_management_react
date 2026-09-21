import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Badge, Box, Button, Container, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const isAdmin = role === 'admin';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const loginRoute = isAdmin ? '/admin/login' : '/login';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Simulate API call to reset password
    setIsSuccess(true);
  };

  return (
    <Container maxW="md" py={12}><Box bg="gray.800" rounded="lg" p={8} borderTopWidth="4px" borderColor={isAdmin ? 'red.400' : 'brand.400'}>
        
        {isAdmin && <Badge colorScheme="red" alignSelf="center" mb={4}>Faculty Portal</Badge>}<Heading size="md" textAlign="center" mb={6} color={isAdmin ? 'red.300' : 'brand.300'}>Reset Password</Heading>
        
        {isSuccess ? (
          <Box textAlign="center"><Text fontSize="4xl" color="green.300" mb={4}>Success</Text><Heading size="sm">Password Updated</Heading><Text color="gray.400" mt={3}>Your password has been successfully reset. You can now log in with your new credentials.</Text><Button as={Link} to={loginRoute} colorScheme={isAdmin ? 'red' : 'brand'} width="full" mt={5}>
              Proceed to Login
            </Button></Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert status="error">{error}</Alert>
            )}
            
            <Stack spacing={5}><Text color="gray.400" textAlign="center">Enter your new password below.</Text><FormControl isRequired><FormLabel>New Password</FormLabel><Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /></FormControl><FormControl isRequired><FormLabel>Confirm New Password</FormLabel><Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              /></FormControl><Button type="submit" width="full" colorScheme={isAdmin ? 'red' : 'brand'}>
              Update Password
            </Button></Stack></form>
        )}
      </Box></Container>
  );
};

export default ResetPassword;