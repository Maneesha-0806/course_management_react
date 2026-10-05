import { useState } from 'react';
import { useSubmissions } from '../context/SubmissionContext';
import { 
  Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, 
  Badge, Button, Flex, Spinner, Modal, ModalOverlay, 
  ModalContent, ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, FormControl, FormLabel, Input, Textarea, useDisclosure 
} from '@chakra-ui/react';

const AdminAssignments = () => {
  // Pull all submissions and the grading function from our context
  const { submissions, loading, gradeSubmission } = useSubmissions();
  
  // Chakra UI hook for managing the Modal open/close state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Local state for the grading form
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="teal.500" />
        <Text ml={4}>Loading student submissions...</Text>
      </Flex>
    );
  }

  // Open the modal and populate the form with existing data (if any)
  const handleOpenGrading = (submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || "");
    setFeedback(submission.feedback || "");
    onOpen();
  };

  // Submit the PUT request to the API
  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;
    setIsSaving(true);

    const updatedData = {
      ...selectedSubmission,
      grade: grade,
      feedback: feedback,
      status: "Graded" // Automatically mark as graded
    };

    const result = await gradeSubmission(selectedSubmission.id, updatedData);
    
    setIsSaving(false);
    if (result.success) {
      onClose(); // Close the modal on success
    } else {
      alert("Failed to save grade. Please try again.");
    }
  };

  return (
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      <Heading mb={2}>Review Assignments</Heading>
      <Text color="gray.500" mb={8}>Evaluate student submissions and provide feedback.</Text>

      <Box overflowX="auto" bg="white" shadow="sm" borderRadius="md" border="1px" borderColor="gray.200">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Student</Th>
              <Th>Course</Th>
              <Th>Assignment</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {submissions.length > 0 ? (
              // Reverse so the newest submissions (like your recent test) appear at the top
              submissions.slice().reverse().map((sub) => (
                <Tr key={sub.id}>
                  <Td fontWeight="bold">{sub.student}</Td>
                  <Td>{sub.course}</Td>
                  <Td>
                    <Text fontWeight="medium">{sub.assignmentTitle}</Text>
                    <Text fontSize="xs" color="gray.500">Submitted: {sub.date}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={sub.status === 'Graded' ? 'green' : 'yellow'}>
                      {sub.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Button 
                      size="sm" 
                      colorScheme={sub.status === 'Graded' ? 'gray' : 'teal'}
                      onClick={() => handleOpenGrading(sub)}
                    >
                      {sub.status === 'Graded' ? 'Edit Grade' : 'Grade'}
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} textAlign="center" py={6} color="gray.500">
                  No submissions found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Grading Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Grade Submission</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            {selectedSubmission && (
              <Box mb={6} p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.500" fontWeight="bold" textTransform="uppercase">
                  Student Submission
                </Text>
                {/* Displaying the exact content the student submitted */}
                <Text mt={2} whiteSpace="pre-wrap">{selectedSubmission.content}</Text>
              </Box>
            )}

            <FormControl isRequired mb={4}>
              <FormLabel>Grade / Score</FormLabel>
              <Input 
                placeholder="e.g., 95/100 or A" 
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Feedback</FormLabel>
              <Textarea 
                placeholder="Provide constructive feedback..." 
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={handleSaveGrade} 
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save Grade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default AdminAssignments;