import { useCourses } from "../context/CourseContext";
import CourseCard from "../components/CourseCard";
import { Box, Grid, Heading, Text, Flex, Spinner } from '@chakra-ui/react';

function Courses() {
  // Extract data from the global CourseContext
  const { courses, loading, error } = useCourses();

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Loading course catalog...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box maxW="container.xl" mx="auto" py={10} textAlign="center">
        <Text color="red.500" fontSize="lg">{error}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      <Heading mb={2} color="gray.800">Course Catalog</Heading>
      <Text color="gray.500" mb={8}>Discover and enroll in our latest courses.</Text>
      
      {!loading && !error && courses.length > 0 ? (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title || course.courseName} // Fallback to handle both schemas
              description={course.description || course.overview}
              category={course.category}
              imageUrl={course.image || course.imageUrl}
            />
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={10} bg="gray.50" borderRadius="md">
          <Text color="gray.500">No courses available at the moment.</Text>
        </Box>
      )}
    </Box>
  );
}

export default Courses;