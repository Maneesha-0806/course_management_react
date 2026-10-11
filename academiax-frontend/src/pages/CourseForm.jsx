import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { 
  Box, Button, FormControl, FormLabel, Input, 
  Textarea, Heading, VStack, Flex, Select 
} from '@chakra-ui/react';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, addCourse, updateCourse } = useCourses();
  
  const isEditMode = Boolean(id);

  // State perfectly mapped to the Express validation requirements
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    instructor: '',
    description: '',
    status: 'Active'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && courses.length > 0) {
      const courseToEdit = courses.find(c => c.id === id || c.id === parseInt(id));
      if (courseToEdit) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          title: courseToEdit.title || courseToEdit.courseName || '',
          category: courseToEdit.category || '',
          instructor: courseToEdit.instructor || '',
          description: courseToEdit.description || '',
          status: courseToEdit.status || 'Active'
        });
      }
    }
  }, [id, courses, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    let result;
    if (isEditMode) {
      result = await updateCourse(id, formData);
    } else {
      result = await addCourse(formData);
    }

    setIsSaving(false);

    if (result && result.success) {
      navigate('/admin/courses');
    } else {
      alert(result?.message || "Failed to save course. Please check your inputs.");
    }
  };

  return (
    <Box maxW="container.md" mx="auto" py={10} px={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>{isEditMode ? 'Edit Course' : 'Create New Course'}</Heading>
        <Button as={RouterLink} to="/admin/courses" variant="outline">Cancel</Button>
      </Flex>

      <Box bg="white" p={6} shadow="md" borderRadius="md" borderTop="4px solid" borderColor="teal.500">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Course Title</FormLabel>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., React Fundamentals" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Web Development" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Instructor</FormLabel>
              <Input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="e.g., Dr. Smith" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Course overview..." rows={4} />
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </Select>
            </FormControl>

            <Button type="submit" colorScheme="teal" size="lg" mt={4} isLoading={isSaving}>
              {isEditMode ? 'Update Course' : 'Publish Course'}
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CourseForm;