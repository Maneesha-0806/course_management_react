import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Box, Button, Container, FormControl, FormLabel, Heading, Input, SimpleGrid, Stack, Text, Textarea } from '@chakra-ui/react';

const Assignments = () => {
  // 1. Mock database of assignments
  const [assignments, setAssignments] = useState([
    { 
      id: 1, 
      courseId: 'fs202',
      course: 'Full Stack Development', 
      title: 'Build a REST API', 
      dueDate: 'Oct 15, 2026', 
      status: 'pending', 
      description: 'Create a Node.js REST API using Express and MongoDB. Include endpoints for GET, POST, PUT, and DELETE. Submit your GitHub repository link below.' 
    },
    { 
      id: 2, 
      courseId: 'ds300',
      course: 'Data Structures', 
      title: 'Binary Tree Implementation', 
      dueDate: 'Oct 20, 2026', 
      status: 'pending', 
      description: 'Implement a Binary Search Tree in Python with insert, delete, and search methods. Upload your .py file.' 
    },
    { 
      id: 3, 
      courseId: 'cs101',
      course: 'Intro to Computer Science', 
      title: 'Variables & Loops', 
      dueDate: 'Sep 10, 2026', 
      status: 'submitted', 
      description: 'Write a simple Python script using a for loop.' 
    }
  ]);

  // 2. Track the currently selected assignment and form input
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0]);
  const [submissionText, setSubmissionText] = useState('');

  // 3. Handle the submission form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the assignment status to 'submitted' in our local state
    const updatedAssignments = assignments.map(a => 
      a.id === selectedAssignment.id ? { ...a, status: 'submitted' } : a
    );
    
    setAssignments(updatedAssignments);
    setSelectedAssignment({ ...selectedAssignment, status: 'submitted' });
    setSubmissionText('');
  };

  return (
    <Container maxW="container.xl" py={10}><Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} mb={8}><Heading size="lg">Assignments</Heading><Button as={Link} to="/dashboard" variant="outline">Back to Dashboard</Button></Stack>
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        {/* Sidebar: Assignment List */}
        <Box bg="gray.800" rounded="lg" overflow="hidden" h="full">
            <Stack spacing={0}>
              {assignments.map(assignment => (
                <button
                  key={assignment.id}
                  onClick={() => setSelectedAssignment(assignment)}
                  style={{ background: selectedAssignment.id === assignment.id ? 'var(--chakra-colors-brand-700)' : undefined, color: 'inherit', border: 0, borderBottom: '1px solid var(--chakra-colors-whiteAlpha-200)', width: '100%', textAlign: 'left' }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}><Text fontSize="sm" color="brand.300">
                      {assignment.course}
                    </Text>
                    {assignment.status === 'submitted' ? (
                      <Badge colorScheme="green">Submitted</Badge>
                    ) : (
                      <Badge colorScheme="yellow">Pending</Badge>
                    )}</Box><Heading size="sm" mb={1}>{assignment.title}</Heading><Text fontSize="sm" color="gray.400">
                    Due: {assignment.dueDate}
                  </Text>
                </button>
              ))}
            </Stack></Box>

        {/* Main Content: Assignment Details & Submission */}
        <Box gridColumn={{ lg: 'span 2' }}>
          {selectedAssignment ? (
            <Box bg="gray.800" rounded="lg" p={6}><Stack direction={{ base: 'column', sm: 'row' }} justify="space-between" align="start" mb={5}><Box><Badge colorScheme="teal" mb={2}>{selectedAssignment.course}</Badge><Heading size="md">{selectedAssignment.title}</Heading></Box><Badge colorScheme={selectedAssignment.status === 'submitted' ? 'green' : 'yellow'} fontSize="sm">
                  {selectedAssignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                </Badge></Stack><Text color="gray.400">Due Date: <Text as="span" color="gray.100">{selectedAssignment.dueDate}</Text></Text><Box borderTopWidth="1px" borderColor="whiteAlpha.200" my={6} /><Heading size="sm">Instructions</Heading><Text color="gray.400" mt={3}>{selectedAssignment.description}</Text><Box bg="gray.900" rounded="lg" p={5} mt={6}><Heading size="sm" mb={4}>Your Submission</Heading>
                
                {selectedAssignment.status === 'submitted' ? (
                  <Alert status="success">
                    <Text>
                      You have successfully submitted this assignment. It is currently pending review by your instructor.
                    </Text>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={4}><FormControl isRequired><FormLabel color="gray.400">Provide a link or text submission</FormLabel><Textarea 
                        rows="4" 
                        placeholder="Paste your GitHub link or type your answer here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        required
                      /></FormControl><FormControl><FormLabel color="gray.400">Or upload a file</FormLabel><Input type="file" /></FormControl><Button type="submit" width="full">Submit Assignment</Button></Stack>
                  </form>
                )}
              </Box></Box>
          ) : (
            <Box bg="gray.800" rounded="lg" p={12} textAlign="center"><Text color="gray.400" fontSize="lg">Select an assignment to view details.</Text></Box>
          )}
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Assignments;