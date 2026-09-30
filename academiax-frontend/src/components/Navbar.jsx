import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Collapse, Container, Flex, HStack, IconButton, Link, Spacer, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isInitializing, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const handleLogout = () => { logout(); onClose(); navigate('/login'); };

  return (
    <Box as="header" bg="gray.900" borderBottomWidth="1px" borderColor="whiteAlpha.200" position="sticky" top="0" zIndex="sticky">
      <Container maxW="container.xl">
        <Flex minH="16" align="center" gap={4}>
          <Link as={RouterLink} to="/" fontSize="xl" fontWeight="800" color="brand.300" onClick={onClose}>AcademiaX</Link>
          <Spacer />
          <IconButton display={{ base: 'flex', md: 'none' }} onClick={onToggle} variant="outline" aria-label="Toggle navigation" icon={<Text fontSize="xl">{isOpen ? 'x' : '≡'}</Text>} />
          <Flex display={{ base: 'none', md: 'flex' }} align="center" gap={5}>
            <Link as={RouterLink} to="/courses">Course Catalog</Link>
            {!isInitializing && user && <>
              <Link as={RouterLink} to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>Dashboard</Link>
              {user.role !== 'admin' && <Link as={RouterLink} to="/my-courses">My Courses</Link>}
              {user.role === 'admin' && <Link as={RouterLink} to="/admin/courses" color="orange.300">Manage Courses</Link>}
              <HStack spacing={3}><Text color="gray.300">{user.role === 'admin' ? 'Faculty' : user.username}</Text><Button onClick={handleLogout} size="sm" variant="outline">Logout</Button></HStack>
            </>}
            {!isInitializing && !user && <Button as={RouterLink} to="/login" size="sm">Login</Button>}
          </Flex>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <Stack display={{ md: 'none' }} pb={4} spacing={3}>
            <Link as={RouterLink} to="/courses" onClick={onClose}>Course Catalog</Link>
            {!isInitializing && user && <>
              <Link as={RouterLink} to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} onClick={onClose}>Dashboard</Link>
              {user.role !== 'admin' && <Link as={RouterLink} to="/my-courses" onClick={onClose}>My Courses</Link>}
              {user.role === 'admin' && <Link as={RouterLink} to="/admin/courses" onClick={onClose}>Manage Courses</Link>}
              <Button onClick={handleLogout} size="sm" alignSelf="flex-start" variant="outline">Logout</Button>
            </>}
            {!isInitializing && !user && <Button as={RouterLink} to="/login" onClick={onClose} size="sm" alignSelf="flex-start">Login</Button>}
          </Stack>
        </Collapse>
      </Container>
    </Box>
  );
};

export default Navbar;