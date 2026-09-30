import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, Flex, Grid, Heading, Text, Card, CardBody, 
  Stat, StatLabel, StatNumber, Badge, Button, 
  VStack, Divider, Progress 
} from '@chakra-ui/react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    // Box is the Chakra equivalent of a generic <div>, but with style props
    <Box maxW="container.xl" mx="auto" py={10} px={4}>
      
      {/* Header Section */}
      <Box mb={10}>
        <Badge colorScheme="blue" mb={3} px={3} py={1} borderRadius="md" fontSize="sm">
          Student Dashboard
        </Badge>
        <Heading size="xl" color="gray.100" letterSpacing="tight">
          Welcome back, {user ? user.username : 'Student'}
        </Heading>
        <Text color="gray.400" mt={2} fontSize="lg">
          Here is your learning overview for today.
        </Text>
      </Box>

      {/* Metrics Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={10}>
        <Card shadow="sm" borderTop="4px solid" borderColor="blue.400" _hover={{ shadow: 'md' }}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.400" textTransform="uppercase" fontWeight="bold">Enrolled Courses</StatLabel>
              <StatNumber fontSize="5xl" fontWeight="black" color="gray.100">3</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card shadow="sm" borderTop="4px solid" borderColor="brand.400" _hover={{ shadow: 'md' }}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.400" textTransform="uppercase" fontWeight="bold">Pending Assignments</StatLabel>
              <StatNumber fontSize="5xl" fontWeight="black" color="gray.100">2</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        
        <Card shadow="sm" borderTop="4px solid" borderColor="green.400" _hover={{ shadow: 'md' }}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.400" textTransform="uppercase" fontWeight="bold">Certificates</StatLabel>
              <StatNumber fontSize="5xl" fontWeight="black" color="gray.100">1</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Main Content Area */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        
        {/* Left Column: Active Course */}
        <Box>
          <Heading size="md" mb={4} color="gray.100">Continue Learning</Heading>
          <Card shadow="sm" overflow="hidden">
            <CardBody p={8}>
              <Flex justify="space-between" align="flex-start" mb={4}>
                <Box>
                  <Badge colorScheme="purple" mb={3} variant="subtle">Engineering</Badge>
                  <Heading size="lg" mb={2}>Full Stack Development</Heading>
                  <Text color="gray.400">Currently on: Module 3 - React State</Text>
                </Box>
                <Badge colorScheme="green" fontSize="sm" px={2} py={1}>85% Complete</Badge>
              </Flex>
              
              {/* Chakra's built-in progress bar */}
              <Progress value={85} size="sm" colorScheme="blue" borderRadius="full" mb={8} mt={4} />
              
              {/* Notice how we blend Chakra's Button with React Router's Link */}
              <Button as={RouterLink} to="/learning/fs202" colorScheme="blue" size="lg" width={{ base: 'full', md: 'auto' }}>
                Resume Learning
              </Button>
            </CardBody>
          </Card>
        </Box>

        {/* Right Column: Up Next */}
        <Box>
          <Heading size="md" mb={4} color="gray.100">Up Next</Heading>
          <Card shadow="sm">
            <CardBody p={6}>
              <VStack align="stretch" spacing={5} divider={<Divider />}>
                
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="bold" color="gray.100">Build a REST API</Text>
                    <Badge colorScheme="red" variant="outline">Due Today</Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.400">Full Stack Development</Text>
                </Box>
                
                <Box>
                  <Flex justify="space-between" mb={1}>
                    <Text fontWeight="bold" color="gray.100">Binary Tree Setup</Text>
                    <Badge colorScheme="gray">Due Oct 20</Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.400">Data Structures</Text>
                </Box>
                
                <Button as={RouterLink} to="/assignments" variant="ghost" colorScheme="blue" size="sm" mt={2}>
                  View All Assignments →
                </Button>
                
              </VStack>
            </CardBody>
          </Card>
        </Box>
        
      </Grid>
    </Box>
  );
};

export default Dashboard;