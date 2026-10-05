import { Link, useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CourseContext'; // Import context
// Import your existing Chakra UI components...
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Heading, Spinner, Text } from '@chakra-ui/react'; 

const AdminCourses = () => {
  // 1. Extract courses and deleteCourse from context
  const { courses, loading, error, deleteCourse } = useCourses(); 
  const navigate = useNavigate();

  // 2. Create the delete handler with a confirmation prompt
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (!confirmed) return;

    try {
      await deleteCourse(id);
      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Unable to delete course.");
    }
  };

  // 3. Handle loading and error states for a better UI
  if (loading) return <Box p={10}><Spinner size="xl" /> <Text>Loading courses...</Text></Box>;
  if (error) return <Box p={10}><Text color="red.500">{error}</Text></Box>;

  return (
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      <Heading mb={6}>Manage Courses</Heading>
      
      <Button colorScheme="blue" mb={6} onClick={() => navigate('/admin/courses/new')}>
        Add New Course
      </Button>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Course Name</Th>
              <Th>Category</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* 4. Map over the API courses instead of local mock data */}
            {courses.map((course) => (
              <Tr key={course.id}>
                {/* Note: Use course.title or courseName depending on your db.json schema */}
                <Td fontWeight="bold">{course.title || course.courseName}</Td>
                <Td>{course.category}</Td>
                <Td>{course.status || 'Active'}</Td>
                <Td>
                  {/* Edit button points to the edit route */}
                  <Button 
                    as={Link} 
                    to={`/admin/courses/${course.id}/edit`} 
                    colorScheme="teal" 
                    size="sm" 
                    mr={2}
                  >
                    Edit
                  </Button>
                  {/* Delete button triggers the API call */}
                  <Button 
                    colorScheme="red" 
                    size="sm" 
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default AdminCourses;