import { useParams, Link as RouterLink } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { 
  Box, Flex, Heading, Text, Button, VStack, Spinner, 
  Progress, Card, CardBody, Badge, Divider 
} from '@chakra-ui/react';

const CourseContent = () => {
  // 1. Get the URL parameter that App.jsx defines for this route (/learning/:courseId)
  const { courseId } = useParams();
  const { courses, loading, error } = useCourses();
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();

  // 2. Handle Loading & Error States
  if (loading || enrollmentsLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={10} textAlign="center">
        <Text color="red.500" fontSize="lg">{error}</Text>
      </Box>
    );
  }

  // 3. Find the course from the global API data
  const course = courses.find((c) => c.id === courseId || c.id === parseInt(courseId));

  if (!course) {
    return (
      <Box p={10} textAlign="center">
        <Heading size="lg" mb={4}>Course Not Found</Heading>
        <Text color="gray.500" mb={6}>We couldn't find the learning content you requested.</Text>
        <Button as={RouterLink} to="/dashboard" colorScheme="blue">
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const enrollment = enrollments.find((item) => String(item.courseId) === String(course.id));
  if (!enrollment) {
    return (
      <Box p={10} textAlign="center">
        <Heading size="lg" mb={4}>Enrollment required</Heading>
        <Text color="gray.500" mb={6}>Enroll in this course before opening its learning roadmap.</Text>
        <Button as={RouterLink} to={`/courses/${course.id}`} colorScheme="blue">View Course</Button>
      </Box>
    );
  }

  const progress = Number(enrollment.progress) || 0;

  // 4. Render the Chakra UI Learning Roadmap
  return (
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      
      {/* Header Section */}
      <Box mb={8}>
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>
          <Box>
            <Badge colorScheme="green" mb={3} px={2} py={1} borderRadius="md">
              Active Enrollment
            </Badge>
            <Heading size="xl" color="gray.800">
              {course.title || course.courseName}
            </Heading>
            <Text color="gray.500" mt={2} fontSize="lg">
              Instructor: {course.instructor}
            </Text>
          </Box>
          
          {/* Optional link to course materials */}
          <Button as={RouterLink} to={`/materials?course=${course.id}`} variant="outline" colorScheme="blue">
            Course Materials
          </Button>
        </Flex>
        
        {/* Progress Bar Widget */}
        <Box mt={8} bg="white" p={5} borderRadius="lg" shadow="sm" border="1px" borderColor="gray.200">
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold" fontSize="sm" color="gray.600" textTransform="uppercase">
              Course Progress
            </Text>
            <Text fontWeight="bold" fontSize="sm" color="blue.600">{progress}%</Text>
          </Flex>
          <Progress value={progress} colorScheme="blue" borderRadius="full" size="sm" />
        </Box>
      </Box>

      <Divider mb={8} />

      {/* Module Roadmap Area */}
      <Heading size="lg" mb={6} color="gray.700">Learning Roadmap</Heading>
      
      <VStack align="stretch" spacing={4}>
        {course.modules && course.modules.length > 0 ? (
          course.modules.map((module, index) => {
            // Ensure we have an ID for routing, fallback to index if missing in db.json
            const moduleId = module.id || `m${index + 1}`;
            const moduleTitle = module.title || module;
            
            return (
              <Card key={moduleId} shadow="sm" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s ease-in-out">
                <CardBody p={6}>
                  <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    
                    <Box>
                      <Text color="gray.500" fontSize="sm" fontWeight="bold" mb={1} letterSpacing="wide">
                        MODULE {index + 1} {module.duration && `• ${module.duration}`}
                      </Text>
                      <Heading size="md" color="gray.800">{moduleTitle}</Heading>
                    </Box>
                    
                    {/* Links to the VideoPlayer page for this specific module */}
                    <Button 
                      as={RouterLink} 
                      to={`/learning/${course.id}/video/${moduleId}`} 
                      colorScheme={index === 0 ? "blue" : "gray"}
                      variant={index === 0 ? "solid" : "outline"}
                      px={8}
                    >
                      {index === 0 ? "Resume" : "Start"}
                    </Button>

                  </Flex>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <Box p={6} textAlign="center" bg="gray.50" borderRadius="md">
            <Text color="gray.500">The instructor has not uploaded any modules yet.</Text>
          </Box>
        )}
      </VStack>
      
    </Box>
  );
};

export default CourseContent;