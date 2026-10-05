import { useState, useContext } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, Heading, Text, Badge, Button, Flex, 
  VStack, Spinner, Divider, Card, CardBody 
} from '@chakra-ui/react';

const CourseDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // Pull in our global contexts
  const { courses, loading, error } = useCourses();
  const { enrollInCourse } = useEnrollments();
  const { user } = useContext(AuthContext);

  // Local state to show a loading spinner on the button while saving
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box maxW="container.md" mx="auto" py={10} textAlign="center">
        <Text color="red.500" fontSize="lg">{error}</Text>
      </Box>
    );
  }

  const course = courses.find((c) => c.id === id || c.id === parseInt(id));

  if (!course) {
    return (
      <Box maxW="container.md" mx="auto" py={10} textAlign="center">
        <Heading size="lg" mb={4}>Course Not Found</Heading>
        <Text color="gray.500" mb={6}>The course you are looking for does not exist.</Text>
        <Button as={RouterLink} to="/courses" colorScheme="blue">
          Back to Catalog
        </Button>
      </Box>
    );
  }

  // The new enrollment handler
  const handleEnroll = async () => {
    if (!user) {
      alert("Please log in to enroll in courses.");
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      alert("Administrators cannot enroll in courses.");
      return;
    }

    setIsEnrolling(true);
    try {
      await enrollInCourse(course.id);
      navigate(`/enrollment-success?id=${encodeURIComponent(course.id)}`);
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Unable to complete enrollment. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <Box maxW="container.lg" mx="auto" py={10} px={4}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        
        {/* Left Column: Main Course Info */}
        <Box flex="2">
          <Badge colorScheme="purple" mb={3} px={2} py={1} borderRadius="md">
            {course.category}
          </Badge>
          <Heading size="2xl" mb={4} color="gray.800">
            {course.title || course.courseName}
          </Heading>
          
          <Text fontSize="xl" color="gray.600" mb={6}>
            {course.description || course.overview}
          </Text>

          <Divider my={8} />

          <Heading size="lg" mb={4}>Course Modules</Heading>
          {course.modules && course.modules.length > 0 ? (
            <VStack align="stretch" spacing={4}>
              {course.modules.map((module, index) => (
                <Card key={module.id || index} variant="outline" shadow="sm">
                  <CardBody>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="bold" fontSize="lg">{module.title || module}</Text>
                      {module.duration && (
                        <Badge colorScheme="blue">{module.duration}</Badge>
                      )}
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">No modules listed for this course yet.</Text>
          )}
        </Box>

        {/* Right Column: Enrollment Card */}
        <Box flex="1">
          <Card shadow="md" borderTop="4px solid" borderColor="blue.500" position="sticky" top="20px">
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text color="gray.500" fontSize="sm" fontWeight="bold" textTransform="uppercase">
                    Instructor
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">{course.instructor}</Text>
                </Box>

                <Box>
                  <Text color="gray.500" fontSize="sm" fontWeight="bold" textTransform="uppercase">
                    Status
                  </Text>
                  <Badge colorScheme={course.status === 'Active' ? 'green' : 'gray'}>
                    {course.status || 'Active'}
                  </Badge>
                </Box>

                {course.totalEnrolled && (
                  <Box>
                    <Text color="gray.500" fontSize="sm" fontWeight="bold" textTransform="uppercase">
                      Enrolled Students
                    </Text>
                    <Text fontSize="lg" fontWeight="semibold">{course.totalEnrolled}</Text>
                  </Box>
                )}

                <Divider />
                
                {/* The updated button with the onClick handler and loading state */}
                <Button 
                  onClick={handleEnroll}
                  isLoading={isEnrolling}
                  loadingText="Enrolling..."
                  colorScheme="blue" 
                  size="lg" 
                  width="full"
                >
                  Enroll Now
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>

      </Flex>
    </Box>
  );
};

export default CourseDetails;