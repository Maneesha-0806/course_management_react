import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Badge, Box, Button, Container, Flex, Heading, Progress, Stack, Text } from '@chakra-ui/react';

const CourseContent = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);

  // Mock data representing the course roadmap
  useEffect(() => {
    const mockDatabase = {
      fs202: {
        title: 'Full Stack Development',
        progress: 25, // percentage
        modules: [
          { id: 'm1', title: 'Frontend Foundations', duration: '2h 15m', completed: true },
          { id: 'm2', title: 'React Single Page Apps', duration: '3h 45m', completed: false },
          { id: 'm3', title: 'Node & Express APIs', duration: '4h 20m', completed: false },
          { id: 'm4', title: 'Database Design with MongoDB', duration: '3h 10m', completed: false }
        ]
      },
      ds300: {
        title: 'Data Structures',
        progress: 60,
        modules: [
          { id: 'm1', title: 'Arrays & Linked Lists', duration: '2h 05m', completed: true },
          { id: 'm2', title: 'Stacks & Queues', duration: '2h 30m', completed: true },
          { id: 'm3', title: 'Trees & Graphs', duration: '3h 40m', completed: false },
          { id: 'm4', title: 'Hashing & Complexity', duration: '2h 50m', completed: false }
        ]
      },
      cs101: {
        title: 'Intro to Computer Science',
        progress: 100,
        modules: [
          { id: 'm1', title: 'Variables & Loops', duration: '1h 45m', completed: true },
          { id: 'm2', title: 'Functions & Logic', duration: '2h 10m', completed: true },
          { id: 'm3', title: 'Data Structures', duration: '2h 35m', completed: true },
          { id: 'm4', title: 'Basic Algorithms', duration: '2h 20m', completed: true }
        ]
      }
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCourseData(mockDatabase[courseId] || null);
  }, [courseId]);

  if (!courseData) {
    return (
      <Container maxW="container.md" py={16} textAlign="center"><Heading>Course not found</Heading><Text color="gray.400" mt={3}>This learning roadmap is not available.</Text><Button as={Link} to="/my-courses" mt={6}>Back to My Courses</Button></Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={8}><Box><Button as={Link} to="/my-courses" variant="link" mb={2}>Back to My Courses</Button><Heading size="lg">{courseData.title} - Roadmap</Heading></Box><Button as={Link} to={`/materials?course=${courseId}`} variant="outline">Course Materials</Button></Flex>

      {/* Progress Bar */}
      <Box bg="gray.800" rounded="lg" p={6} mb={10}><Flex justify="space-between" mb={2}><Text fontWeight="bold">Course Progress</Text><Text>{courseData.progress}%</Text></Flex><Progress value={courseData.progress} colorScheme="green" rounded="full" /></Box>

      {/* Module Roadmap */}
      <Heading size="md" mb={4}>Modules & Lessons</Heading>
      <Stack spacing={3}>
        {courseData.modules.map((mod, index) => (
          <Flex key={mod.id} bg="gray.800" borderWidth="1px" borderColor="whiteAlpha.200" rounded="lg" p={5} justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4}><Flex align="center" gap={4}><Badge colorScheme={mod.completed ? 'green' : 'blue'}>{mod.completed ? 'Complete' : 'Next'}</Badge><Box><Heading size="sm">Module {index + 1}: {mod.title}</Heading><Text color="gray.400" fontSize="sm" mt={1}>Duration: {mod.duration}</Text></Box></Flex><Button as={Link} to={`/learning/${courseId}/video/${mod.id}`} variant={mod.completed ? 'outline' : 'solid'}>{mod.completed ? 'Review Lesson' : 'Start Lesson'}</Button></Flex>
        ))}
      </Stack>
    </Container>
  );
};

export default CourseContent;