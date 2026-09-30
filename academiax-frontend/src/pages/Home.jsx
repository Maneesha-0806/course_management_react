import { Link } from 'react-router-dom';
import { Box, Button, Container, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

const Home = () => {
  return (
    <Container maxW="container.xl" py={{ base: 10, md: 16 }}>
      <Box bg="gray.800" borderWidth="1px" borderColor="whiteAlpha.200" rounded="lg" p={{ base: 8, md: 16 }} textAlign="center" shadow="lg">
        <Heading size={{ base: 'xl', md: '2xl' }} color="brand.300">Welcome to AcademiaX</Heading>
        <Text fontSize="lg" color="gray.400" mt={4}>Your ultimate course management and learning platform.</Text>
        <Stack direction={{ base: 'column', sm: 'row' }} justify="center" mt={8} spacing={4}>
          <Button as={Link} to="/courses" size="lg">Browse Courses</Button>
          <Button as={Link} to="/register" variant="outline" size="lg">Join Now</Button>
        </Stack>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} textAlign="center" mt={16}>
        <Box><Heading size="md">Learn Anywhere</Heading><Text color="gray.400" mt={2}>Access your materials on any device.</Text></Box>
        <Box><Heading size="md">Expert Faculty</Heading><Text color="gray.400" mt={2}>Learn from the best in the industry.</Text></Box>
        <Box><Heading size="md">Track Progress</Heading><Text color="gray.400" mt={2}>Monitor your academic journey effortlessly.</Text></Box>
      </SimpleGrid>
    </Container>
  );
};

export default Home;