import { useSearchParams, Link } from 'react-router-dom';
import { Button, Container, Heading, List, ListItem, Text, Flex } from '@chakra-ui/react';

const courseMaterials = {
  fs202: {
    title: 'Full Stack Development',
    materials: ['React setup guide', 'REST API checklist', 'MongoDB schema worksheet']
  },
  ds300: {
    title: 'Data Structures',
    materials: ['Complexity reference sheet', 'Tree traversal exercises', 'Graph algorithms worksheet']
  }
};

const CourseMaterials = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');
  const course = courseMaterials[courseId];

  if (!course) {
    return (
      <Container maxW="container.md" py={16} textAlign="center"><Heading>Materials not found</Heading><Text color="gray.400" mt={3}>Choose a course from your learning roadmap to view its materials.</Text><Button as={Link} to="/my-courses" mt={6}>Back to My Courses</Button></Container>
    );
  }

  return (
    <Container maxW="container.lg" py={10}>
      <Button as={Link} to={`/learning/${courseId}`} variant="link" mb={6}>Back to Roadmap</Button>
      <Heading size="lg">{course.title} Materials</Heading><Text color="gray.400" mt={2} mb={6}>Reference files and worksheets for this course.</Text>
      <List borderWidth="1px" borderColor="whiteAlpha.200" rounded="lg" overflow="hidden">
        {course.materials.map((material) => (
          <ListItem key={material} p={4} borderBottomWidth="1px" borderColor="whiteAlpha.200"><Flex justify="space-between" align="center" gap={4}><Text>{material}</Text><Button size="sm" variant="outline" isDisabled>Download soon</Button></Flex></ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CourseMaterials;
