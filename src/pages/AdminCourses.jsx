import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, Container, Flex, Heading, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

const AdminCourses = () => {
  const [courses] = useState([
    { id: 'fs202', title: 'Full Stack Development', category: 'Engineering', students: 145, status: 'Active' },
    { id: 'ds300', title: 'Data Structures', category: 'Engineering', students: 98, status: 'Active' },
    { id: 'cs101', title: 'Intro to Computer Science', category: 'Science', students: 312, status: 'Active' },
    { id: 'ui404', title: 'UX/UI Principles', category: 'Arts', students: 0, status: 'Draft' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCourses = courses.filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.id.toLowerCase().includes(searchTerm.toLowerCase()));
  return <Container maxW="container.xl" py={10}><Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={8}><Box><Badge colorScheme="red" mb={2}>Faculty Portal</Badge><Heading size="lg">Course Management</Heading></Box><Flex gap={3}><Button as={Link} to="/admin/dashboard" variant="outline">Back to Dashboard</Button><Button as={Link} to="/admin/courses/new" colorScheme="red">Create Course</Button></Flex></Flex><Box bg="gray.800" rounded="lg" overflow="hidden"><Box p={5}><Input placeholder="Search courses by title or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} maxW="lg" /></Box><TableContainer><Table><Thead><Tr><Th>Course ID</Th><Th>Title</Th><Th>Category</Th><Th>Students</Th><Th>Status</Th><Th isNumeric>Actions</Th></Tr></Thead><Tbody>{filteredCourses.length === 0 ? <Tr><Td colSpan={6} textAlign="center" py={12} color="gray.400">No courses found matching "{searchTerm}"</Td></Tr> : filteredCourses.map(course => <Tr key={course.id}><Td fontWeight="bold" color="gray.400">{course.id.toUpperCase()}</Td><Td fontWeight="bold">{course.title}</Td><Td><Badge colorScheme="teal">{course.category}</Badge></Td><Td>{course.students}</Td><Td><Badge colorScheme={course.status === 'Active' ? 'green' : 'gray'}>{course.status}</Badge></Td><Td isNumeric><Flex justify="end" gap={2}><Button as={Link} to={`/admin/courses/${course.id}/edit`} size="sm" variant="outline" aria-label={`Edit ${course.title}`}>Edit</Button><Button as={Link} to={`/admin/courses/${course.id}/roster`} size="sm" variant="outline" aria-label={`View roster for ${course.title}`}>Roster</Button></Flex></Td></Tr>)}</Tbody></Table></TableContainer></Box></Container>;
};
export default AdminCourses;
