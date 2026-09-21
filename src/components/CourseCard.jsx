import { Link as RouterLink } from 'react-router-dom';
import { Badge, Button, Card, CardBody, Heading, Image, Stack, Text } from '@chakra-ui/react';

const CourseCard = ({ id, title, description, category, imageUrl }) => (
  <Card h="full" overflow="hidden" transition="all 0.2s" _hover={{ transform: 'translateY(-4px)', shadow: 'xl', borderColor: 'brand.400' }}>
    <Image src={imageUrl || 'https://placehold.co/600x400/1a202c/81e6d9?text=Course+Image'} alt={title} h="180px" objectFit="cover" />
    <CardBody><Stack h="full" spacing={3}><Badge alignSelf="flex-start" colorScheme="teal">{category}</Badge><Heading size="md">{title}</Heading><Text color="gray.400" flex="1">{description}</Text><Button as={RouterLink} to={`/courses/${id}`} variant="outline" width="full">View Details</Button></Stack></CardBody>
  </Card>
);

export default CourseCard;