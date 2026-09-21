import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, Container, Heading, Progress, SimpleGrid, Stack, Text } from '@chakra-ui/react';

const MyCourses = () => {
  // 1. Manage tab state (defaults to 'ongoing')
  const [activeTab, setActiveTab] = useState('ongoing');

  // 2. Mock database of the student's enrolled courses
  const enrolledCourses = [
    { id: 'fs202', title: 'Full Stack Development', category: 'Engineering', progress: 25, status: 'ongoing' },
    { id: 'ds300', title: 'Data Structures', category: 'Engineering', progress: 60, status: 'ongoing' },
    { id: 'cs101', title: 'Intro to Computer Science', category: 'Science', progress: 100, status: 'completed' }
  ];

  // 3. Filter the courses based on which tab is clicked
  const displayedCourses = enrolledCourses.filter(course => course.status === activeTab);

  return (
    <Container maxW="container.xl" py={10}>
      <Heading size="lg" mb={6}>My Courses</Heading>
      
      {/* Bootstrap Tabs mapped to React State */}
      <Stack direction="row" borderBottomWidth="1px" borderColor="whiteAlpha.300" mb={8} spacing={6}>
          <Button variant="ghost" borderBottomWidth="2px" borderColor={activeTab === 'ongoing' ? 'brand.300' : 'transparent'} color={activeTab === 'ongoing' ? 'brand.300' : 'gray.400'}
            onClick={() => setActiveTab('ongoing')}
          >Ongoing</Button>
          <Button variant="ghost" borderBottomWidth="2px" borderColor={activeTab === 'completed' ? 'brand.300' : 'transparent'} color={activeTab === 'completed' ? 'brand.300' : 'gray.400'}
            onClick={() => setActiveTab('completed')}
          >Completed</Button>
      </Stack>

      {/* Course Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {displayedCourses.length === 0 ? (
          <Box gridColumn="1 / -1" textAlign="center" py={12}><Text color="gray.400" fontSize="lg">No courses found in this category.</Text><Button as={Link} to="/courses" variant="outline" mt={4}>Browse Catalog</Button></Box>
        ) : (
          displayedCourses.map(course => (
            <Box key={course.id} bg="gray.800" borderWidth="1px" borderColor="whiteAlpha.200" rounded="lg" p={6} minH="260px" display="flex" flexDirection="column">
                  <Badge alignSelf="flex-start" colorScheme="teal" mb={3}>{course.category}</Badge><Heading size="md">{course.title}</Heading>
                  <Box mt="auto" pt={6}><Text color="gray.400" fontWeight="bold" mb={2}>{course.progress}% Completed</Text><Progress value={course.progress} colorScheme={course.progress === 100 ? 'green' : 'brand'} mb={5} rounded="full" />
                    {course.status === 'ongoing' ? (
                      <Button as={Link} to={`/learning/${course.id}`} width="full">
                        Continue Learning
                      </Button>
                    ) : (
                      // This maps to the certificate.html page from the prototype
                      <Button as={Link} to={`/certificate/${course.id}`} width="full" colorScheme="green">View Certificate</Button>
                    )}
                  </Box>
            </Box>
          ))
        )}
      </SimpleGrid>
    </Container>
  );
};

export default MyCourses;