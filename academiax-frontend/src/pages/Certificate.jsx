import { useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { 
  Box, Flex, Heading, Text, Button, Spinner, 
  VStack, Divider, Card, CardBody 
} from '@chakra-ui/react';

const Certificate = () => {
  // Get the courseId from the URL (e.g., /certificate/fs202)
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const { courses, loading: coursesLoading } = useCourses();
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();

  if (coursesLoading || enrollmentsLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4}>Verifying completion status...</Text>
      </Flex>
    );
  }

  // 1. Look up the course and enrollment data
  const course = courses.find((c) => c.id === courseId || c.id === parseInt(courseId));
  const enrollment = enrollments.find((e) => e.courseId === courseId || e.courseId === parseInt(courseId));

  // 2. Security Guard: Check if the enrollment exists
  if (!course || !enrollment) {
    return (
      <Box p={10} textAlign="center">
        <Heading size="lg" mb={4}>Record Not Found</Heading>
        <Text color="gray.500" mb={6}>We couldn't find an enrollment record for this course.</Text>
        <Button as={RouterLink} to="/my-courses" colorScheme="blue">Back to My Courses</Button>
      </Box>
    );
  }

  // 3. Security Guard: Check if progress is actually 100%
  if (enrollment.progress < 100) {
    return (
      <Box p={10} textAlign="center">
        <Heading size="lg" mb={4}>Certificate Not Available</Heading>
        <Text color="gray.500" mb={6}>You must complete 100% of the course modules to earn your certificate.</Text>
        <Button as={RouterLink} to={`/learning/${course.id}`} colorScheme="teal">
          Continue Learning
        </Button>
      </Box>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Format today's date for the certificate
  const completionDate = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <Box maxW="container.lg" mx="auto" py={10} px={4}>
      
      {/* Action Buttons (Hidden during print) */}
      <Flex justify="space-between" align="center" mb={6} className="no-print">
        <Button as={RouterLink} to="/my-courses" variant="ghost" colorScheme="blue">
          &larr; Back to Dashboard
        </Button>
        <Button onClick={handlePrint} colorScheme="teal" shadow="md">
          Download / Print PDF
        </Button>
      </Flex>

      {/* Certificate Container */}
      <Card 
        id="certificate-container"
        border="8px double" 
        borderColor="teal.600" 
        bg="white" 
        shadow="2xl" 
        p={{ base: 4, sm: 8, md: 12 }}
        textAlign="center"
      >
        <CardBody>
          <VStack spacing={8}>
            
            <Text fontSize="2xl" color="teal.700" fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
              AcademiaX
            </Text>
            
            <Heading size={{ base: 'xl', md: '3xl' }} fontFamily="serif" color="gray.800">
              Certificate of Completion
            </Heading>
            
            <Text fontSize="xl" color="gray.600" fontStyle="italic">
              This is to proudly certify that
            </Text>
            
            {/* Dynamically pulls the user's exact API name */}
            <Heading size={{ base: 'xl', md: '2xl' }} color="blue.600" textDecoration="underline" textUnderlineOffset="10px" overflowWrap="anywhere">
              {user?.name || "Student Name"}
            </Heading>
            
            <Text fontSize="xl" color="gray.600" fontStyle="italic">
              has successfully completed the course
            </Text>
            
            {/* Dynamically pulls the course title */}
            <Heading size="xl" color="gray.800">
              {course.title || course.courseName}
            </Heading>
            
            <Text color="gray.500" maxW="2xl" fontSize="lg">
              Demonstrating proficiency in {course.category} by completing all required modules, assessments, and learning objectives.
            </Text>
            
            <Divider my={4} />
            
            <Flex w="full" justify="space-around" pt={4} gap={6} wrap="wrap">
              <Box textAlign="center" w={{ base: 'full', sm: '200px' }}>
                <Text fontSize="xl" fontWeight="bold">{completionDate}</Text>
                <Divider borderColor="gray.400" my={2} />
                <Text fontSize="sm" color="gray.500" textTransform="uppercase">Date Completed</Text>
              </Box>
              
              <Box textAlign="center" w={{ base: 'full', sm: '200px' }}>
                <Text fontSize="xl" fontWeight="bold" fontFamily="cursive">{course.instructor}</Text>
                <Divider borderColor="gray.400" my={2} />
                <Text fontSize="sm" color="gray.500" textTransform="uppercase">Lead Instructor</Text>
              </Box>
            </Flex>

          </VStack>
        </CardBody>
      </Card>
      
      {/* Print-specific CSS to hide everything else on the page */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #certificate-container, #certificate-container * {
              visibility: visible;
            }
            #certificate-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none;
              border: 12px double #234e52; /* teal.800 */
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Certificate;