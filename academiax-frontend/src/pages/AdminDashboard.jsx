import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useCourses } from '../context/CourseContext';
import { useSubmissions } from '../context/SubmissionContext';
import api from '../services/api';
import { 
  Box, Grid, Heading, Text, Card, CardBody, 
  Stat, StatLabel, StatNumber, Flex, Spinner, 
  VStack, Badge, Button, Divider 
} from '@chakra-ui/react';

const AdminDashboard = () => {
  // 1. Pull global data from our established contexts
  const { courses, loading: coursesLoading } = useCourses();
  const { submissions, loading: submissionsLoading } = useSubmissions();
  
  // 2. Fetch all enrollments directly from the API for the dashboard summary
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  useEffect(() => {
    const fetchAllEnrollments = async () => {
      try {
        const response = await api.get('/enrollments');
        setTotalEnrollments(response.data.length);
      } catch (error) {
        console.error("Failed to fetch global enrollments:", error);
      } finally {
        setEnrollmentsLoading(false);
      }
    };
    fetchAllEnrollments();
  }, []);

  // 3. Handle unified loading state
  if (coursesLoading || submissionsLoading || enrollmentsLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4}>Loading dashboard metrics...</Text>
      </Flex>
    );
  }

  // Filter submissions to find actionable items
  const pendingSubmissions = submissions.filter(s => s.status === 'Pending');

  return (
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      
      {/* Header Section */}
      <Flex justify="space-between" align="flex-end" mb={8} wrap="wrap" gap={4}>
        <Box>
          <Heading color="gray.800" mb={2}>Faculty Dashboard</Heading>
          <Text color="gray.500">Welcome back! Here is what's happening across your courses today.</Text>
        </Box>
        <Button as={RouterLink} to="/admin/courses/new" colorScheme="teal" shadow="md">
          + Create Course
        </Button>
      </Flex>

      {/* Key Metrics Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={10}>
        <Card shadow="sm" borderTop="4px solid" borderColor="blue.500">
          <CardBody>
            <Stat>
              <StatLabel color="gray.500" fontSize="sm" fontWeight="bold" textTransform="uppercase">
                Total Courses
              </StatLabel>
              <StatNumber fontSize="4xl" color="gray.800">{courses.length}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card shadow="sm" borderTop="4px solid" borderColor="teal.500">
          <CardBody>
            <Stat>
              <StatLabel color="gray.500" fontSize="sm" fontWeight="bold" textTransform="uppercase">
                Active Enrollments
              </StatLabel>
              <StatNumber fontSize="4xl" color="gray.800">{totalEnrollments}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        {/* Dynamic border color: Orange if grading is needed, Green if all caught up */}
        <Card shadow="sm" borderTop="4px solid" borderColor={pendingSubmissions.length > 0 ? "orange.400" : "green.400"}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.500" fontSize="sm" fontWeight="bold" textTransform="uppercase">
                Pending Grading
              </StatLabel>
              <StatNumber fontSize="4xl" color="gray.800">{pendingSubmissions.length}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Bottom Section: Action Items & Links */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        
        {/* Left Column: Actionable Submissions */}
        <Box>
          <Heading size="md" mb={6} color="gray.700">Needs Attention</Heading>
          <VStack spacing={4} align="stretch">
            {pendingSubmissions.length > 0 ? (
              // Show up to 5 of the most recent pending submissions
              pendingSubmissions.slice(0, 5).reverse().map((sub) => (
                <Card key={sub.id} shadow="sm" variant="outline" _hover={{ shadow: 'md' }}>
                  <CardBody>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                      <Box>
                        <Badge colorScheme="orange" mb={2}>Requires Grading</Badge>
                        <Heading size="sm" mb={1}>{sub.assignmentTitle}</Heading>
                        <Text fontSize="sm" color="gray.600">
                          Submitted by <b>{sub.student}</b> in {sub.course}
                        </Text>
                      </Box>
                      <Button as={RouterLink} to="/admin/assignments" colorScheme="teal" size="sm">
                        Review & Grade
                      </Button>
                    </Flex>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Box p={6} textAlign="center" bg="green.50" borderRadius="md" border="1px dashed" borderColor="green.200">
                <Text color="green.700" fontWeight="bold" mb={1}>All caught up!</Text>
                <Text color="green.600" fontSize="sm">There are no assignments waiting to be graded.</Text>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Right Column: Quick Links */}
        <Box>
          <Heading size="md" mb={6} color="gray.700">Quick Links</Heading>
          <Card shadow="sm">
            <CardBody>
              <VStack align="stretch" spacing={2}>
                <Button as={RouterLink} to="/admin/courses" variant="ghost" justifyContent="flex-start" colorScheme="teal">
                  Manage Course Catalog
                </Button>
                <Divider />
                <Button as={RouterLink} to="/admin/assignments" variant="ghost" justifyContent="flex-start" colorScheme="teal">
                  View All Submissions
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Box>
        
      </Grid>
    </Box>
  );
};

export default AdminDashboard;