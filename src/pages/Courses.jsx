import CourseCard from '../components/CourseCard';
import { Container, Heading, SimpleGrid } from '@chakra-ui/react';

const Courses = () => {
  // Mock data to replace the hard-coded HTML cards
  const courseList = [
    { id: 'fs202', title: 'Full Stack Development', category: 'Engineering', description: 'Learn React, Node, and MongoDB.' },
    { id: 'cs101', title: 'Intro to Computer Science', category: 'Science', description: 'The fundamentals of programming and algorithms.' },
    { id: 'ds300', title: 'Data Structures', category: 'Engineering', description: 'Advanced data manipulation and storage.' }
  ];

  return (
    <Container maxW="container.xl" py={10}>
      <Heading size="lg" mb={8}>Course Catalog</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {courseList.map(course => (
          <div key={course.id}>
            <CourseCard 
              id={course.id}
              title={course.title}
              category={course.category}
              description={course.description}
            />
          </div>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Courses;