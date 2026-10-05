import { useNotifications } from '../context/NotificationContext';
import { 
  Box, Heading, Text, VStack, Card, CardBody, 
  Flex, Badge, Button, Spinner, Alert
} from '@chakra-ui/react';

const Notifications = () => {
  const { notifications, loading, error, markAsRead } = useNotifications();

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Loading notifications...</Text>
      </Flex>
    );
  }

  // Sort notifications so Unread items appear first, then newest first
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead === b.isRead) {
      return new Date(b.date) - new Date(a.date);
    }
    return a.isRead ? 1 : -1;
  });

  return (
    <Box maxW="container.md" mx="auto" py={10} px={4}>
      <Heading mb={2} color="gray.800">Notifications</Heading>
      <Text color="gray.500" mb={8}>Stay updated on your course progress and grades.</Text>
      {error && <Alert status="error" mb={6}>{error}</Alert>}

      <VStack spacing={4} align="stretch">
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notif) => (
            <Card 
              key={notif.id} 
              shadow="sm" 
              borderLeft="4px solid" 
              borderColor={notif.isRead ? "gray.300" : "blue.500"}
              bg={notif.isRead ? "white" : "blue.50"}
              transition="all 0.2s"
            >
              <CardBody>
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                  <Box flex="1">
                    <Flex align="center" mb={2}>
                      {!notif.isRead && (
                        <Badge colorScheme="blue" mr={2}>New</Badge>
                      )}
                      <Text fontSize="sm" color="gray.500">
                        {new Date(notif.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </Text>
                    </Flex>
                    
                    <Text fontWeight={notif.isRead ? "normal" : "bold"} color="gray.800">
                      {notif.message}
                    </Text>
                  </Box>
                  
                  {!notif.isRead && (
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      variant="outline"
                      onClick={() => markAsRead(notif.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </Flex>
              </CardBody>
            </Card>
          ))
        ) : (
          <Box p={6} textAlign="center" bg="gray.50" borderRadius="md">
            <Text color="gray.500">You're all caught up! No new notifications.</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Notifications;