import { useParams, Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Box, Button, Container, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';

const Certificate = () => {
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);
  const [courseData, setCourseData] = useState(null);

  // Mock database to fetch completed course details
  useEffect(() => {
    const mockDatabase = {
      cs101: {
        title: 'Intro to Computer Science',
        completionDate: 'September 15, 2026',
        instructor: 'Dr. Grace Hopper',
        certificateId: 'ACAD-CS101-84729'
      },
      fs202: {
        title: 'Full Stack Development',
        completionDate: 'October 10, 2026',
        instructor: 'Dr. Alan Turing',
        certificateId: 'ACAD-FS202-39281'
      }
    };
    
    // Fallback for demo purposes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCourseData(mockDatabase[courseId] || mockDatabase['cs101']);
  }, [courseId]);

  // Native browser print function
  const handlePrint = () => {
    window.print();
  };

  if (!courseData) return <Container py={12} textAlign="center">Loading certificate...</Container>;

  return (
    <Container maxW="container.xl" py={10}>
      {/* Action Bar - Hidden during print */}
      <Flex justify="space-between" mb={6} sx={{ '@media print': { display: 'none' } }}><Button as={Link} to="/my-courses" variant="outline">Back to My Courses</Button><Button onClick={handlePrint}>Download / Print</Button></Flex>

      {/* Certificate Wrapper */}
      <Box bg="gray.100" color="gray.900" minH="600px" p={3} rounded="lg"><Box borderWidth="4px" borderColor="blue.500" p={2} h="full"><Box borderWidth="2px" borderColor="teal.500" p={{ base: 6, md: 16 }} minH="580px" display="flex" flexDirection="column" justifyContent="center" alignItems="center" textAlign="center">
              
              {/* Certificate Content */}
              <Box mb={6}><Text fontSize="5xl" color="orange.400">Award</Text><Heading size="xl" textTransform="uppercase" color="blue.600" fontFamily="Georgia, serif">
                  Certificate of Completion
                </Heading></Box>

              <Text fontSize="lg" color="gray.600" mb={5}>This is to proudly certify that</Text>
              
              <Heading size="xl" mb={5} borderBottomWidth="1px" borderColor="gray.500" px={8} pb={2} fontFamily="Georgia, serif">
                {user ? user.username : 'Student Name'}
              </Heading>
              
              <Text fontSize="lg" color="gray.600" mb={5}>has successfully completed the course</Text>
              
              <Heading size="lg" mb={10}>
                {courseData.title}
              </Heading>

              {/* Signatures and Date */}
              <SimpleGrid columns={3} w="full" mt={10} pt={6}><Box textAlign="center"><Text fontWeight="bold" borderBottomWidth="1px" pb={2}>{courseData.completionDate}</Text><Text fontSize="sm" color="gray.600" textTransform="uppercase">Date of Completion</Text></Box><Box /><Box textAlign="center"><Text borderBottomWidth="1px" pb={2} fontFamily="cursive">
                    {courseData.instructor}
                  </Text><Text fontSize="sm" color="gray.600" textTransform="uppercase">Lead Instructor</Text></Box></SimpleGrid>

              {/* Certificate ID Footer */}
              <Text mt={10} pt={6} w="full" textAlign="left" fontSize="sm" color="gray.600">Certificate ID: {courseData.certificateId}</Text>

            </Box></Box></Box>
    </Container>
  );
};

export default Certificate;