import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { useCourses } from '../context/CourseContext';
import { useSubmissions } from '../context/SubmissionContext';
import { 
  Alert, Box, Grid, Heading, Text, VStack, FormControl, 
  FormLabel, Select, Input, Textarea, Button, Card, 
  CardBody, Badge, Flex, Spinner 
} from '@chakra-ui/react';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();
  const { courses, loading: coursesLoading } = useCourses();
  const { submissions, loading: submissionsLoading, error: submissionsError, addSubmission } = useSubmissions();

  // Form State
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (enrollmentsLoading || coursesLoading || submissionsLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Loading your assignments...</Text>
      </Flex>
    );
  }

  // Generate the list of courses the student is enrolled in for the dropdown
  const enrolledCourses = enrollments
    .map(enr => courses.find(c => c.id === enr.courseId))
    .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format date to match db.json schema (e.g., "Oct 14, 2026")
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    const newSubmission = {
      student: user.name,
      course: selectedCourseName,
      assignmentTitle,
      date: formattedDate,
      status: "Pending",
      content,
      grade: "",
      feedback: ""
    };

    const result = await addSubmission(newSubmission);
    
    if (result.success) {
      alert("Assignment submitted successfully!");
      // Reset form
      setSelectedCourseName("");
      setAssignmentTitle("");
      setContent("");
    } else {
      alert(result.message);
    }
    
    setIsSubmitting(false);
  };

  return (
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      <Heading mb={2} color="gray.800">Assignments</Heading>
      <Text color="gray.500" mb={8}>Submit your coursework and view past grades.</Text>
      {submissionsError && <Alert status="error" mb={6}>{submissionsError}</Alert>}

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={10}>
        
        {/* Left Column: Submission Form */}
        <Box>
          <Card shadow="sm" borderTop="4px solid" borderColor="blue.500">
            <CardBody>
              <Heading size="md" mb={6}>Submit New Assignment</Heading>
              
              {enrolledCourses.length === 0 ? (
                <Text color="red.500">You must be enrolled in a course to submit assignments.</Text>
              ) : (
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    
                    <FormControl isRequired>
                      <FormLabel>Select Course</FormLabel>
                      <Select 
                        placeholder="Choose a course" 
                        value={selectedCourseName} 
                        onChange={(e) => setSelectedCourseName(e.target.value)}
                      >
                        {enrolledCourses.map((course) => (
                          <option key={course.id} value={course.title || course.courseName}>
                            {course.title || course.courseName}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Assignment Title</FormLabel>
                      <Input 
                        placeholder="e.g., Build a REST API" 
                        value={assignmentTitle} 
                        onChange={(e) => setAssignmentTitle(e.target.value)} 
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Submission Content or Link</FormLabel>
                      <Textarea 
                        placeholder="Paste your code, text, or a link to your repository..." 
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </FormControl>

                    <Button 
                      type="submit" 
                      colorScheme="blue" 
                      size="lg" 
                      isLoading={isSubmitting}
                      loadingText="Submitting..."
                    >
                      Submit Assignment
                    </Button>
                  </VStack>
                </form>
              )}
            </CardBody>
          </Card>
        </Box>

        {/* Right Column: Submission History */}
        <Box>
          <Heading size="md" mb={6}>Submission History</Heading>
          
          <VStack spacing={4} align="stretch">
            {submissions.length > 0 ? (
              submissions.slice().reverse().map((sub) => (
                <Card key={sub.id} shadow="sm" variant="outline">
                  <CardBody>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Badge colorScheme={sub.status === 'Graded' ? 'green' : 'yellow'}>
                        {sub.status}
                      </Badge>
                      <Text fontSize="sm" color="gray.500">{sub.date}</Text>
                    </Flex>
                    
                    <Heading size="sm" mb={1}>{sub.assignmentTitle}</Heading>
                    <Text fontSize="sm" color="gray.600" mb={3}>{sub.course}</Text>
                    
                    {sub.status === 'Graded' && (
                      <Box bg="gray.50" p={3} borderRadius="md" mt={2}>
                        <Text fontWeight="bold" color="blue.600" mb={1}>Grade: {sub.grade}</Text>
                        <Text fontSize="sm" color="gray.700">Feedback: {sub.feedback}</Text>
                      </Box>
                    )}
                  </CardBody>
                </Card>
              ))
            ) : (
              <Box p={6} textAlign="center" bg="gray.50" borderRadius="md">
                <Text color="gray.500">You haven't submitted any assignments yet.</Text>
              </Box>
            )}
          </VStack>
        </Box>

      </Grid>
    </Box>
  );
};

export default Assignments;