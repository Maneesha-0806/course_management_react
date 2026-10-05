import { Link } from 'react-router-dom';
import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';

const NotFound = () => (
  <Container maxW="md" py={20}>
    <Stack align="center" spacing={4} textAlign="center">
      <Heading color="brand.300">Page not found</Heading>
      <Text color="gray.400">The page you requested does not exist.</Text>
      <Button as={Link} to="/" colorScheme="teal">Return home</Button>
    </Stack>
  </Container>
);

export default NotFound;