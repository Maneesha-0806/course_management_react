import { Link as RouterLink } from 'react-router-dom';
import { Card, CardBody, Image, Heading, Text, Badge, Button, VStack, Flex } from '@chakra-ui/react';

const CourseCard = ({ id, title, description, category, imageUrl }) => {
  return (
    <Card shadow="sm" _hover={{ shadow: 'md', transform: 'translateY(-2px)' }} transition="all 0.2s" height="100%">
      {/* Render image if provided, otherwise a fallback colored box */}
      {imageUrl ? (
        <Image src={imageUrl} alt={title} height="160px" objectFit="cover" borderTopRadius="md" />
      ) : (
        <Flex height="160px" bg="blue.500" borderTopRadius="md" align="center" justify="center">
          <Heading size="md" color="white" px={4} textAlign="center">{title}</Heading>
        </Flex>
      )}
      
      <CardBody>
        <VStack align="stretch" spacing={3} height="100%">
          <Flex justify="space-between" align="flex-start">
            <Badge colorScheme="purple" borderRadius="md">{category || 'General'}</Badge>
          </Flex>
          
          <Heading size="md" color="gray.800" noOfLines={2}>
            {title}
          </Heading>
          
          <Text color="gray.600" fontSize="sm" noOfLines={3} flex="1">
            {description}
          </Text>
          
          <Button as={RouterLink} to={`/courses/${id}`} colorScheme="blue" size="sm" mt="auto">
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default CourseCard;