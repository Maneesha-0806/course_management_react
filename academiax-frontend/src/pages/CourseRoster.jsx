import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCourses } from '../context/CourseContext';
import { Badge, Box, Button, Container, Flex, Heading, Input, Progress, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';

const CourseRoster = () => {
  const { id } = useParams();
  const { courses } = useCourses();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const course = courses.find((item) => String(item.id) === String(id));

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        setLoading(true);
        const [usersResponse, enrollmentsResponse] = await Promise.all([
          api.get('/users'),
          api.get('/enrollments')
        ]);
        const usersById = new Map(usersResponse.data.map((user) => [String(user.id), user]));
        const roster = enrollmentsResponse.data
          .filter((enrollment) => String(enrollment.courseId) === String(id))
          .map((enrollment) => {
            const student = usersById.get(String(enrollment.userId));
            return {
              id: enrollment.id,
              name: student?.name || `User ${enrollment.userId}`,
              email: student?.email || 'Email unavailable',
              date: enrollment.date || enrollment.createdAt || 'Not available',
              progress: Number(enrollment.progress) || 0
            };
          });
        setStudents(roster);
        setError('');
      } catch (fetchError) {
        console.error('Failed to fetch roster:', fetchError);
        setError('Unable to load this course roster.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, [id]);

  const filteredStudents = students.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDropStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName} from this course?`)) return;
    try {
      await api.delete(`/enrollments/${studentId}`);
      setStudents((previousStudents) => previousStudents.filter((student) => student.id !== studentId));
    } catch (deleteError) {
      console.error('Failed to remove student:', deleteError);
      setError('Unable to remove this student.');
    }
  };

  return <Container maxW="container.xl" py={10}><Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={8}><Box><Badge colorScheme="red" mb={2}>Faculty Portal</Badge><Heading size="lg">Student Roster</Heading><Text color="gray.400">{course?.title || course?.courseName || 'Course Details'} ({id.toUpperCase()})</Text></Box><Button as={Link} to="/admin/courses" variant="outline">Back to Catalog</Button></Flex><Box bg="gray.800" rounded="lg" overflow="hidden"><Flex p={5} justify="space-between" align="center" gap={4} wrap="wrap"><Input maxW="lg" placeholder="Search students by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><Text color="gray.400" fontWeight="bold">Total Enrolled: {students.length}</Text></Flex>{error && <Text color="red.300" px={5} pb={4}>{error}</Text>}{loading ? <Text p={12} textAlign="center">Loading roster...</Text> : <TableContainer><Table><Thead><Tr><Th>Student Name</Th><Th>Email Address</Th><Th>Enrollment Date</Th><Th>Course Progress</Th><Th isNumeric>Actions</Th></Tr></Thead><Tbody>{filteredStudents.length === 0 ? <Tr><Td colSpan={5} textAlign="center" py={12} color="gray.400">No students found matching "{searchTerm}"</Td></Tr> : filteredStudents.map(student => <Tr key={student.id}><Td fontWeight="bold">{student.name}</Td><Td color="gray.400">{student.email}</Td><Td>{student.date}</Td><Td minW="180px"><Flex justify="space-between" fontSize="sm" mb={1}><Text>{student.progress}%</Text>{student.progress === 100 && <Badge colorScheme="green">Complete</Badge>}</Flex><Progress value={student.progress} colorScheme={student.progress === 100 ? 'green' : 'brand'} size="sm" /></Td><Td isNumeric><Button onClick={() => handleDropStudent(student.id, student.name)} size="sm" variant="outline" colorScheme="red" aria-label={`Drop ${student.name}`}>Drop Student</Button></Td></Tr>)}</Tbody></Table></TableContainer>}</Box></Container>;
};
export default CourseRoster;
