import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge, Box, Button, Container, FormControl, FormLabel, Heading, Input, Link as ChakraLink, Stack, Text } from '@chakra-ui/react';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'student'; // Default to student
  const isAdmin = role === 'admin';

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending a password reset email
    setIsSubmitted(true);
  };

  const loginRoute = isAdmin ? '/admin/login' : '/login';

  return (
    <Container maxW="md" py={12}><Box bg="gray.800" rounded="lg" p={8} borderTopWidth="4px" borderColor={isAdmin ? 'red.400' : 'brand.400'}>
        
        {isAdmin && <Badge colorScheme="red" alignSelf="center" mb={4}>Faculty Portal</Badge>}
        <Heading size="md" textAlign="center" mb={6} color={isAdmin ? 'red.300' : 'brand.300'}>Forgot Password</Heading>
        
        {isSubmitted ? (
          <Box textAlign="center"><Text fontSize="4xl" color="green.300" mb={4}>Email Sent</Text><Text color="gray.400">
              If an account exists for <strong>{email}</strong>, a recovery link has been sent.
            </Text>
            {/* Link to the reset page to simulate the user clicking the email link */}
            <Button as={Link} to={`/reset-password?role=${role}`} width="full" mt={4} colorScheme={isAdmin ? 'red' : 'brand'}>
              Simulate Email Link Click
            </Button></Box>
        ) : (
          <form onSubmit={handleSubmit}><Stack spacing={5}><Text color="gray.400" textAlign="center">
              Enter your registered {isAdmin ? 'institutional ' : ''}email address and we will send you a link to reset your password.
            </Text><FormControl isRequired><FormLabel>Email Address</FormLabel><Input 
                type="email" 
                placeholder={isAdmin ? "name@academiax.edu" : "student@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              /></FormControl><Button type="submit" width="full" colorScheme={isAdmin ? 'red' : 'brand'}>
              Send Recovery Link
            </Button></Stack></form>
        )}
        
        <Text textAlign="center" mt={5}><ChakraLink as={Link} to={loginRoute} color={isAdmin ? 'red.300' : 'brand.300'}>Back to Login</ChakraLink></Text>
      </Box></Container>
  );
};

export default ForgotPassword;