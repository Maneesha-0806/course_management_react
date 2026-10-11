import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCourses } from '../context/CourseContext';
import { Badge, Box, Button, Container, Flex, Heading, Input, Progress, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';

const CourseRoster = () => {
  const { id } = useParams();
  const { courses = [] } = useCourses() || {};
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const safeCourses = Array.isArray(courses) ? courses : [];
  const course = safeCourses.find((item) => String(item.id) === String(id));
  const courseTitle = course?.title || course?.courseName || 'Course Details';

  useEffect(() => {
    let isMounted = true;

    const fetchRoster = async () => {
      try {
        setLoading(true);
        const [usersResponse, enrollmentsResponse] = await Promise.all([
          api.get('/users'),
          api.get('/enrollments')
        ]);

        const usersById = new Map(
          Array.isArray(usersResponse.data) ? usersResponse.data.map((user) => [String(user.id), user]) : []
        );

        const roster = (Array.isArray(enrollmentsResponse.data) ? enrollmentsResponse.data : [])
          .filter((enrollment) => String(enrollment.courseId) === String(id))
          .map((enrollment) => {
            const student = usersById.get(String(enrollment.userId));
            const progress = Number(enrollment.progress) || 0;

            return {
              id: enrollment.id,
              name: student?.name || `User ${enrollment.userId}`,
              email: student?.email || 'Email unavailable',
              date: enrollment.date || enrollment.createdAt || 'Not available',
              progress: Math.min(Math.max(progress, 0), 100)
            };
          });

        if (isMounted) {
          setStudents(roster);
          setError('');
        }
      } catch (fetchError) {
        console.error('Failed to fetch roster:', fetchError);
        if (isMounted) {
          setStudents([]);
          setError('Unable to load this course roster.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRoster();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredStudents = students.filter((student) => {
    const name = String(student.name || '').toLowerCase();
    const email = String(student.email || '').toLowerCase();
    return !normalizedSearch || name.includes(normalizedSearch) || email.includes(normalizedSearch);
  });

  const handleDropStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName} from this course?`)) return;
    try {
      await api.delete(`/enrollments/${studentId}`);
      setStudents((previousStudents) => previousStudents.filter((student) => student.id !== studentId));
      setError('');
    } catch (deleteError) {
      console.error('Failed to remove student:', deleteError);
      setError('Unable to remove this student.');
    }
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={8}>
        <Box>
          <Badge colorScheme="red" mb={2}>Faculty Portal</Badge>
          <Heading size="lg">Student Roster</Heading>
          <Text color="gray.400">{courseTitle} ({String(id || 'unknown').toUpperCase()})</Text>
        </Box>
        <Button as={Link} to="/admin/courses" variant="outline">Back to Catalog</Button>
      </Flex>

      <Box bg="gray.800" rounded="lg" overflow="hidden">
        <Flex p={5} justify="space-between" align="center" gap={4} wrap="wrap">
          <Input
            maxW="lg"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Text color="gray.400" fontWeight="bold">Total Enrolled: {students.length}</Text>
        </Flex>

        {error && <Text color="red.300" px={5} pb={4}>{error}</Text>}

        {loading ? (
          <Text p={12} textAlign="center">Loading roster...</Text>
        ) : (
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Student Name</Th>
                  <Th>Email Address</Th>
                  <Th>Enrollment Date</Th>
                  <Th>Course Progress</Th>
                  <Th isNumeric>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredStudents.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={12} color="gray.400">
                      {searchTerm ? `No students found matching "${searchTerm}"` : 'No students are enrolled in this course yet.'}
                    </Td>
                  </Tr>
                ) : (
                  filteredStudents.map((student) => (
                    <Tr key={student.id}>
                      <Td fontWeight="bold">{student.name}</Td>
                      <Td color="gray.400">{student.email}</Td>
                      <Td>{student.date}</Td>
                      <Td minW="180px">
                        <Flex justify="space-between" fontSize="sm" mb={1}>
                          <Text>{student.progress}%</Text>
                          {student.progress === 100 && <Badge colorScheme="green">Complete</Badge>}
                        </Flex>
                        <Progress value={student.progress} colorScheme={student.progress === 100 ? 'green' : 'brand'} size="sm" />
                      </Td>
                      <Td isNumeric>
                        <Button
                          onClick={() => handleDropStudent(student.id, student.name)}
                          size="sm"
                          variant="outline"
                          colorScheme="red"
                          aria-label={`Drop ${student.name}`}
                        >
                          Drop Student
                        </Button>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};
export default CourseRoster;
