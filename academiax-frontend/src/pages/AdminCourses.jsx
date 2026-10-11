import { Link as RouterLink } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { 
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, 
  Button, Flex, Badge, Text, Spinner
} from '@chakra-ui/react';

const AdminCourses = () => {
  const { courses, loading, deleteCourse } = useCourses();

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteCourse(id);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4}>Loading courses...</Text>
      </Flex>
    );
  }

  return (
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
        <Box>
          <Heading mb={2}>Manage Courses</Heading>
          <Text color="gray.500">Create, edit, and remove courses from the catalog.</Text>
        </Box>
        <Button as={RouterLink} to="/admin/courses/new" colorScheme="teal" shadow="md">
          + Add New Course
        </Button>
      </Flex>

      <Box overflowX="auto" bg="white" shadow="sm" borderRadius="md" border="1px" borderColor="gray.200">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Course Title</Th>
              <Th>Category</Th>
              <Th>Instructor</Th>
              <Th>Status</Th>
              <Th textAlign="right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <Tr key={course.id}>
                  <Td fontWeight="bold" color="gray.800">
                    {course.title || course.courseName || "Untitled Course"}
                  </Td>
                  <Td>{course.category}</Td>
                  <Td>{course.instructor}</Td>
                  <Td>
                    <Badge colorScheme={course.status === 'Active' ? 'green' : 'gray'}>
                      {course.status || 'Active'}
                    </Badge>
                  </Td>
                  <Td textAlign="right">
                    <Button as={RouterLink} to={`/admin/courses/${course.id}/edit`} size="sm" colorScheme="blue" mr={2}>
                      Edit
                    </Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(course.id, course.title || course.courseName)}>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" py={6} color="gray.500">
                  No courses found in the database.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AdminCourses;