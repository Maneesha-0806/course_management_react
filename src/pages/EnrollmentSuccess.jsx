import { useSearchParams, Link } from 'react-router-dom';
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react';

const EnrollmentSuccess = () => {
  // 1. Grab the query parameters from the URL
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id');

  return (
    <Container maxW="lg" py={12}><Box bg="gray.800" rounded="lg" p={{ base: 8, md: 12 }} textAlign="center" shadow="lg">
        <Text fontSize="5xl" color="green.300" mb={4} aria-label="Success">Success</Text>
        <Heading size="lg" mb={4}>Enrollment Successful!</Heading>
        <Text color="gray.400" mb={8}>
          You are now officially enrolled in the course. Your learning materials, roadmap, and assignments have been unlocked.
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }} justify="center" spacing={4}>
          {/* This will eventually lead to the course-content.html equivalent */}
          {courseId ? (
            <Button as={Link} to={`/learning/${courseId}`} size="lg">
              Start Learning Now
            </Button>
          ) : (
            <Button as={Link} to="/courses" size="lg">
              Browse Courses
            </Button>
          )}
          
          {/* This maps to the my-courses.html enrolled-course view */}
          <Button as={Link} to="/my-courses" variant="outline" size="lg">
            View My Courses
          </Button>
        </Stack>
      </Box></Container>
  );
};

export default EnrollmentSuccess;