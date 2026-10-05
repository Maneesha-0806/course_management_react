import { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { 
  Box, Flex, Heading, Text, Button, AspectRatio, 
  VStack, Spinner, Card, CardBody, Divider 
} from '@chakra-ui/react';

const VideoPlayer = () => {
  // 1. Get the route parameters defined in App.jsx
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  
  const { courses, loading: coursesLoading } = useCourses();
  const { enrollments, loading: enrollmentsLoading, updateEnrollmentProgress } = useEnrollments();
  
  const [isCompleting, setIsCompleting] = useState(false);

  if (coursesLoading || enrollmentsLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Loading module...</Text>
      </Flex>
    );
  }

  // 2. Find the course and verify the user is actually enrolled
  const course = courses.find((c) => c.id === courseId || c.id === parseInt(courseId));
  const enrollment = enrollments.find((e) => e.courseId === courseId || e.courseId === parseInt(courseId));

  if (!course || !enrollment) {
    return (
      <Box p={10} textAlign="center">
        <Heading size="lg" mb={4}>Access Denied</Heading>
        <Text color="gray.500" mb={6}>You must be enrolled in this course to view its content.</Text>
        <Button as={RouterLink} to="/courses" colorScheme="blue">Browse Catalog</Button>
      </Box>
    );
  }

  // 3. Locate the specific module being viewed (handles both objects and strings from db.json)
  const modules = Array.isArray(course.modules) ? course.modules : [];
  const moduleIndex = modules.findIndex((m, idx) => 
    m.id === moduleId || `m${idx + 1}` === moduleId
  );
  if (moduleIndex < 0) {
    return (
      <Box p={10} textAlign="center">
        <Heading size="lg" mb={4}>Module Not Found</Heading>
        <Text color="gray.500" mb={6}>This course does not contain the requested module.</Text>
        <Button as={RouterLink} to={`/learning/${course.id}`} colorScheme="blue">Back to Roadmap</Button>
      </Box>
    );
  }

  const currentModule = modules[moduleIndex];
  const moduleTitle = currentModule?.title || currentModule || "Video Lesson";

  // 4. Handle progress calculation and API save
  const handleMarkComplete = async () => {
    setIsCompleting(true);
    
    // Calculate how much percentage one module is worth
    const totalModules = modules.length || 1;
    const progressIncrement = Math.round(100 / totalModules);
    
    // Add the increment, but cap progress at exactly 100%
    const newProgress = Math.min(Number(enrollment.progress) + progressIncrement, 100);

    // Send the PUT request to db.json
    await updateEnrollmentProgress(enrollment.id, newProgress);
    
    setIsCompleting(false);
    navigate(`/learning/${course.id}`); // Send student back to the roadmap
  };

  return (
    <Box maxW="container.lg" mx="auto" py={10} px={4}>
      <Button as={RouterLink} to={`/learning/${course.id}`} variant="link" colorScheme="blue" mb={6}>
        &larr; Back to {course.title || course.courseName}
      </Button>

      <Card shadow="md" overflow="hidden" border="1px" borderColor="gray.200">
        {/* Simulated Video Embed using Chakra AspectRatio */}
        <AspectRatio ratio={16 / 9} bg="gray.900">
          <Flex direction="column" justify="center" align="center" color="white">
            <Text fontSize="4xl" mb={2}>▶</Text>
            <Heading size="md" color="whiteAlpha.900">{moduleTitle}</Heading>
            <Text color="whiteAlpha.600" mt={2}>Simulated Video Playback</Text>
          </Flex>
        </AspectRatio>

        <CardBody>
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap={4}>
            <Box>
              <Text color="gray.500" fontSize="sm" fontWeight="bold" textTransform="uppercase" mb={1}>
                Module {moduleIndex + 1}
              </Text>
              <Heading size="lg" color="gray.800">{moduleTitle}</Heading>
            </Box>
            
            <Button 
              colorScheme="green" 
              size="lg" 
              onClick={handleMarkComplete}
              isLoading={isCompleting}
              loadingText="Saving..."
            >
              Mark Module Complete
            </Button>
          </Flex>
          
          <Divider my={6} />
          
          <VStack align="stretch" spacing={4}>
            <Heading size="sm" color="gray.700">Module Overview</Heading>
            <Text color="gray.600">
              In this lesson, we will cover the foundational concepts of {moduleTitle}. 
              Make sure to take notes and follow along with the provided examples. 
              Once you have finished watching, click the "Mark Module Complete" button above to update your course progress on your dashboard!
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default VideoPlayer;