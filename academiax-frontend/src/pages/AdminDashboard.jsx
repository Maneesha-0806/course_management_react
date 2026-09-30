import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Badge, Box, Button, Container, Heading, SimpleGrid, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';

const AdminDashboard = () => {
  // Pull the admin's name from global state
  const { user } = useContext(AuthContext);

  // Mock database for faculty metrics
  const adminData = {
    metrics: {
      totalStudents: 1245,
      activeCourses: 24,
      pendingEvaluations: 38
    },
    recentActivity: [
      { id: 1, action: 'Jane Doe submitted assignment for FS202', time: '10 mins ago' },
      { id: 2, action: 'New student enrolled in Intro to Computer Science', time: '1 hour ago' },
      { id: 3, action: 'Course "Data Structures" syllabus updated', time: '3 hours ago' }
    ]
  };

    return (
      <Container maxW="container.xl" py={10}>
        <Box borderBottomWidth="1px" borderColor="whiteAlpha.200" pb={5} mb={8}>
          <Badge colorScheme="red" mb={3}>Faculty Portal</Badge>
          <Heading size="lg">Welcome, {user ? user.username : 'Administrator'}</Heading>
          <Text color="gray.400" mt={2}>Here is your institutional overview and daily briefing.</Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
          {[
            ['Total Students', adminData.metrics.totalStudents, 'blue'],
            ['Active Courses', adminData.metrics.activeCourses, 'green'],
            ['Pending Evaluations', adminData.metrics.pendingEvaluations, 'yellow']
          ].map(([label, value, color]) => (
            <Box key={label} bg="gray.800" borderLeftWidth="4px" borderColor={`${color}.400`} rounded="lg" p={6}>
              <Text color="gray.400" textTransform="uppercase" fontWeight="bold" fontSize="sm">{label}</Text>
              <Heading size="xl" mt={2}>{value}</Heading>
            </Box>
          ))}
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
          <Box>
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <VStack align="stretch" bg="gray.800" rounded="lg" overflow="hidden" spacing={0}>
              <Button as={Link} to="/admin/courses" variant="ghost" justifyContent="start" rounded={0}>Manage Course Catalog</Button>
              <Button as={Link} to="/admin/courses/new" variant="ghost" justifyContent="start" rounded={0}>Create New Course</Button>
              <Button as={Link} to="/admin/courses/fs202/roster" variant="ghost" justifyContent="start" rounded={0}>View Student Rosters</Button>
              <Button as={Link} to="/admin/assignments" variant="ghost" justifyContent="start" rounded={0}>Review Assignments</Button>
            </VStack>
          </Box>
          <Box gridColumn={{ lg: 'span 2' }}>
            <Heading size="md" mb={4}>Recent Activity</Heading>
            <TableContainer bg="gray.800" rounded="lg">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Action</Th>
                    <Th isNumeric>Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {adminData.recentActivity.map(activity => (
                    <Tr key={activity.id}>
                      <Td>{activity.action}</Td>
                      <Td isNumeric color="gray.400" fontSize="sm">{activity.time}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </SimpleGrid>
      </Container>
  );
};

export default AdminDashboard;