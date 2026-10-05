import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { Box, Button, FormControl, FormLabel, Input, Select, Textarea, Heading, VStack } from '@chakra-ui/react';

const CourseForm = () => {
  const { id } = useParams(); // Get the ID from the URL if it exists
  const navigate = useNavigate();
  const { courses, addCourse, updateCourse } = useCourses(); 

  // Form state
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [instructor, setInstructor] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const isEditMode = Boolean(id);

  // Load existing data if in Edit Mode
  useEffect(() => {
    if (isEditMode && courses.length > 0) {
      const existingCourse = courses.find((item) => item.id === id || item.id === parseInt(id));
      if (existingCourse) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCourseName(existingCourse.courseName || existingCourse.title || "");
        setCourseCode(existingCourse.courseCode || "");
        setInstructor(existingCourse.instructor || "");
        setDuration(existingCourse.duration || "");
        setCategory(existingCourse.category || "");
        setDescription(existingCourse.description || existingCourse.overview || "");
      }
    }
  }, [id, courses, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const coursePayload = {
      courseName,     // Note: If db.json uses "title", change this key to "title: courseName"
      courseCode,
      instructor,
      duration,
      category,
      description,    // Note: If db.json uses "overview", change to "overview: description"
      level: "Beginner",
      status: "Active",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png" 
    };

    try {
      if (isEditMode) {
        // PUT request
        await updateCourse(id, coursePayload);
        alert("Course updated successfully!");
      } else {
        // POST request
        await addCourse(coursePayload);
        alert("Course added successfully!");
      }
      navigate('/admin/courses'); // Return to admin list
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Unable to save course.");
    }
  };

  return (
    <Box maxW="container.md" mx="auto" py={10} px={4}>
      <Heading mb={6}>{isEditMode ? "Edit Course" : "Add New Course"}</Heading>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Course Name</FormLabel>
            <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Course Code</FormLabel>
            <Input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Instructor</FormLabel>
            <Input value={instructor} onChange={(e) => setInstructor(e.target.value)} />
          </FormControl>

          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Select category">
              <option value="Programming">Programming</option>
              <option value="Engineering">Engineering</option>
              <option value="Computer Science">Computer Science</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg" mt={4}>
            {isEditMode ? "Update Course" : "Add Course"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CourseForm;