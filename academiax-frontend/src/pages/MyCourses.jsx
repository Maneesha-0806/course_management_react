import { useEnrollments } from '../context/EnrollmentContext';
import { useCourses } from '../context/CourseContext';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, Grid, Heading, Text, Card, CardBody, 
  Badge, Progress, Button, Flex, VStack, Spinner 
} from '@chakra-ui/react';

const MyCourses = () => {
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();
  const { courses, loading: coursesLoading } = useCourses();

  if (enrollmentsLoading || coursesLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Loading your learning profile...</Text>
      </Flex>
    );
  }

  return (
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      <Heading mb={2} color="gray.800">My Courses</Heading>
      <Text color="gray.500" mb={8}>Track your progress and continue learning.</Text>

      {enrollments.length > 0 ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {enrollments.map((enrollment) => {
            // Cross-reference the enrollment API with the course API to get the title/category
            const course = courses.find(c => c.id === enrollment.courseId);
            
            // If the course was deleted by an admin but the enrollment remains, skip rendering
            if (!course) return null;

            return (
              <Card key={enrollment.id} shadow="sm" borderTop="4px solid" borderColor="teal.400" _hover={{ shadow: 'md' }}>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Flex justify="space-between" align="flex-start">
                      <Badge colorScheme={enrollment.status === 'Completed' ? 'green' : 'blue'}>
                        {enrollment.status}
                      </Badge>
                      <Text fontSize="sm" color="gray.500" fontWeight="bold">
                        {enrollment.progress}%
                      </Text>
                    </Flex>

                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>{course.category}</Text>
                      <Heading size="md" color="gray.800" noOfLines={2}>
                        {course.title || course.courseName}
                      </Heading>
                    </Box>

                    <Progress 
                      value={enrollment.progress} 
                      colorScheme={enrollment.progress === 100 ? "green" : "blue"} 
                      size="sm" 
                      borderRadius="full" 
                    />

                    <Button 
                      as={RouterLink} 
                      to={`/learning/${course.id}`} 
                      colorScheme="teal" 
                      variant={enrollment.progress === 100 ? "outline" : "solid"}
                      size="sm" 
                      mt={2}
                    >
                      {enrollment.progress === 100 ? "Review Course" : "Continue Learning"}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </Grid>
      ) : (
        <Box textAlign="center" py={10} bg="gray.50" borderRadius="md">
          <Text color="gray.500" mb={4}>You haven't enrolled in any courses yet.</Text>
          <Button as={RouterLink} to="/courses" colorScheme="blue">
            Browse Catalog
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MyCourses;