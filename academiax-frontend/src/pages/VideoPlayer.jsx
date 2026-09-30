import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Badge, Box, Button, Container, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

const VideoPlayer = () => {
  // Extract both parameters from the URL
  const { courseId, moduleId } = useParams();
  
  // Manage the "mark-complete interaction" locally
  const [isCompleted, setIsCompleted] = useState(false);

  const handleMarkComplete = () => {
    setIsCompleted(!isCompleted);
    // In a real app, you would also trigger an API call to save this progress here.
  };

  return (
    <Box minH="100vh" py={8}><Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={6}><Button as={Link} to={`/learning/${courseId}`} variant="link">Back to Roadmap</Button><Badge fontSize="md" px={3} py={2}>Module {moduleId.replace('m', '')}</Badge></Flex>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box><Box aspectRatio={16 / 9} bg="gray.900" rounded="lg" display="flex" alignItems="center" justifyContent="center" textAlign="center" p={6}><Stack><Text fontSize="4xl" color="brand.300">Video</Text><Text fontSize="lg">Video Player for {courseId} - Lesson {moduleId}</Text></Stack></Box>
            <Box bg="gray.800" mt={4} rounded="lg" p={6}><Flex justify="space-between" align="start" gap={4} direction={{ base: 'column', sm: 'row' }}><Box><Heading size="md">Understanding the Basics</Heading><Text color="gray.400" mt={2}>Instructor Name</Text></Box><Button 
                    onClick={handleMarkComplete} 
                    colorScheme={isCompleted ? 'green' : 'brand'} variant={isCompleted ? 'solid' : 'outline'}>{isCompleted ? 'Completed' : 'Mark as Complete'}</Button></Flex><Box borderTopWidth="1px" borderColor="whiteAlpha.200" mt={6} pt={6}><Heading size="sm">Lesson Description</Heading><Text color="gray.400" mt={3}>
                  In this lesson, we will cover the core concepts you need to succeed in this module. 
                  Make sure to take notes and download the attached reference materials before proceeding to the quiz.
                </Text></Box></Box>
          </Box>
          <Box bg="gray.800" rounded="lg" p={5} alignSelf="start"><Heading size="sm" mb={4}>Up Next</Heading><Stack spacing={0}>{[['1. Understanding the Basics', '15:30', 'Playing'], ['2. Advanced Implementations', '22:15', 'Locked'], ['3. Module Quiz', '10 Questions', 'Locked']].map(([title, duration, state], index) => <Flex key={title} justify="space-between" p={4} borderTopWidth={index ? '1px' : 0} borderColor="whiteAlpha.200" color={index ? 'gray.400' : 'brand.300'}><Box><Text fontWeight="bold">{title}</Text><Text fontSize="sm" color="gray.500">{duration}</Text></Box><Text fontSize="sm">{state}</Text></Flex>)}</Stack></Box>
        </SimpleGrid>
      </Container></Box>
  );
};

export default VideoPlayer;