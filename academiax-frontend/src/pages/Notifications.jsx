import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, Button, Container, Flex, Heading, Stack, Text } from '@chakra-ui/react';

const Notifications = () => {
  // 1. Mock database of notifications with an 'isRead' flag
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'assignment', 
      message: 'New assignment "Build a REST API" posted in Full Stack Development.', 
      time: '2 hours ago', 
      isRead: false,
      link: '/assignments'
    },
    { 
      id: 2, 
      type: 'grade', 
      message: 'Your Data Structures grade is available for review.', 
      time: '1 day ago', 
      isRead: false,
      link: '/courses/ds300'
    },
    { 
      id: 3, 
      type: 'system', 
      message: 'Scheduled maintenance will occur on Sunday at 2:00 AM.', 
      time: '3 days ago', 
      isRead: true,
      link: '#'
    },
    { 
      id: 4, 
      type: 'course', 
      message: 'You successfully enrolled in Intro to Computer Science.', 
      time: '1 week ago', 
      isRead: true,
      link: '/my-courses'
    }
  ]);

  // 2. Calculate unread count dynamically
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 3. Handlers for the "mark-read" interactions
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  // Helper function to render a readable notification label.
  const getIcon = (type) => {
    switch(type) {
      case 'assignment': return 'Assignment';
      case 'grade': return 'Grade';
      case 'course': return 'Course';
      default: return 'System';
    }
  };

  return (
    <Container maxW="container.lg" py={10}><Box>
          
          {/* Header area with dynamic count */}
          <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4} mb={8}><Flex align="center" gap={3}><Heading size="lg">Notifications</Heading>{unreadCount > 0 && <Badge colorScheme="red" rounded="full">{unreadCount} New</Badge>}</Flex><Stack direction="row">
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  Mark all as read
                </Button>
              )}
              <Button as={Link} to="/dashboard" variant="outline" size="sm">Back to Dashboard</Button></Stack></Flex>

          {/* Notification Timeline List */}
          <Box bg="gray.800" rounded="lg" overflow="hidden"><Stack spacing={0}>
              {notifications.length === 0 ? (
                <Text p={12} textAlign="center" color="gray.400">You have no notifications.</Text>
              ) : (
                notifications.map(note => (
                  <div 
                    key={note.id} 
                    style={{ opacity: note.isRead ? 0.7 : 1, borderBottom: '1px solid var(--chakra-colors-whiteAlpha-200)' }}
                  >
                    <Flex align="start" p={5} gap={4}><Badge colorScheme={note.isRead ? 'gray' : 'blue'}>{getIcon(note.type)}</Badge><Box flex="1"><Flex justify="space-between" align="center" mb={2}><Text fontSize="sm" fontWeight="bold">{note.time}</Text>
                          
                          {/* The mark-read interaction button */}
                          {!note.isRead && (
                            <Button 
                              onClick={() => markAsRead(note.id)}
                              variant="link" color="brand.300" fontSize="sm"
                              title="Mark as read"
                            >
                              Mark as read
                            </Button>
                          )}
                        </Flex><Text fontWeight={note.isRead ? 'normal' : 'bold'} mb={3}>{note.message}</Text>
                        
                        {note.link !== '#' && (
                          <Button as={Link} to={note.link} variant={note.isRead ? 'outline' : 'solid'} size="sm">
                            View Details
                          </Button>
                        )}
                      </Box></Flex>
                  </div>
                ))
              )}
          </Stack></Box>

      </Box></Container>
  );
};

export default Notifications;