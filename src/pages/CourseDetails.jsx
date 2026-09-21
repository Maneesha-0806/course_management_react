import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Badge, Box, Button, Container, Divider, Heading, List, ListItem, SimpleGrid, Stack, Text } from '@chakra-ui/react';

const CourseDetails = () => {
  // 1. Extract the ID from the URL (e.g., "fs202")
  const { id } = useParams();
  
  // 2. Set up state to hold the course data
  const [course, setCourse] = useState(null);

  // 3. Simulate fetching data from your API/database
  useEffect(() => {
    // In the future, this will be a real fetch() call to your backend.
    // For now, we mock the database response based on the ID.
    const mockDatabase = {
      fs202: {
        title: 'Full Stack Development',
        category: 'Engineering',
        instructor: 'Dr. Alan Turing',
        duration: '12 Weeks',
        description: 'Master the MERN stack. Build scalable web applications from scratch using React, Node.js, Express, and MongoDB.',
        modules: ['Frontend Foundations', 'React Single Page Apps', 'Node & Express APIs', 'Database Design with MongoDB']
      },
      cs101: {
        title: 'Intro to Computer Science',
        category: 'Science',
        instructor: 'Grace Hopper',
        duration: '8 Weeks',
        description: 'Learn the fundamentals of programming, algorithms, and data structures using Python.',
        modules: ['Variables & Loops', 'Functions & Logic', 'Data Structures', 'Basic Algorithms']
      },
      ds300: {
        title: 'Data Structures',
        category: 'Engineering',
        instructor: 'Ada Lovelace',
        duration: '10 Weeks',
        description: 'Build a strong foundation in trees, graphs, hashing, and efficient data organization.',
        modules: ['Arrays & Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Hashing & Complexity']
      }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCourse(mockDatabase[id]);
  }, [id]);

  // 4. Handle the loading state or invalid IDs
  if (!course) {
    return (
      <Container maxW="container.md" py={16} textAlign="center"><Heading>Course not found</Heading><Button as={Link} to="/courses" mt={6}>Back to Catalog</Button></Container>
    );
  }

  // 5. Render the actual course page
  return (
    <Container maxW="container.xl" py={10}>
      <Button as={Link} to="/courses" variant="link" mb={6}>Back to Catalog</Button>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
        <Box><Badge colorScheme="teal" mb={3}>{course.category}</Badge><Heading size="xl">{course.title}</Heading><Text fontSize="lg" color="gray.400" mt={4}>{course.description}</Text>
          <Heading size="md" mt={12} mb={4}>Course Syllabus</Heading><List spacing={0} borderWidth="1px" borderColor="whiteAlpha.200" rounded="lg" overflow="hidden">
            {course.modules.map((mod, index) => (
              <ListItem key={index} px={5} py={4} borderBottomWidth={index === course.modules.length - 1 ? 0 : '1px'} borderColor="whiteAlpha.200"><Badge mr={3} rounded="full">{index + 1}</Badge>{mod}</ListItem>
            ))}
          </List>
        </Box>
        <Box bg="gray.800" borderWidth="1px" borderColor="brand.400" rounded="lg" p={6} alignSelf="start" position="sticky" top="2rem"><Heading size="md" mb={6}>Course Overview</Heading><Stack spacing={4} color="gray.300"><Text>Instructor: {course.instructor}</Text><Text>Duration: {course.duration}</Text><Text>Certificate of Completion</Text></Stack><Divider my={6} borderColor="whiteAlpha.200" /><Button as={Link} to={`/enrollment-success?id=${id}`} width="full" size="lg">Enroll Now</Button></Box>
      </SimpleGrid>
    </Container>
  );
};

export default CourseDetails;