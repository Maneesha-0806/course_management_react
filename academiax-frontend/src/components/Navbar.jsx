import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    /* Using a dark background to match the teal/dark theme vibe */
    <Box bg="gray.900" color="white" px={4} shadow="md" position="sticky" top={0} zIndex={1000}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto">
        
        {/* Left Side: Logo */}
        <Text fontSize="2xl" fontWeight="bold" letterSpacing="tight" color="teal.300">
          <RouterLink to="/">AcademiaX</RouterLink>
        </Text>

        {/* Center: Navigation Links */}
        <HStack spacing={8} alignItems="center">
          <HStack as="nav" spacing={2} display={{ base: 'none', md: 'flex' }}>
            <Button as={RouterLink} to="/courses" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }}>
              Catalog
            </Button>

            {/* Render Student-only links */}
            {user && user.role === 'student' && (
              <>
                <Button as={RouterLink} to="/dashboard" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }}>
                  Dashboard
                </Button>
                <Button as={RouterLink} to="/my-courses" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }}>
                  My Courses
                </Button>
              </>
            )}

            {/* Render Admin-only links */}
            {user && user.role === 'admin' && (
              <>
                <Button as={RouterLink} to="/admin/dashboard" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }}>
                  Admin Dashboard
                </Button>
                <Button as={RouterLink} to="/admin/courses" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }}>
                  Manage Courses
                </Button>
              </>
            )}
          </HStack>
        </HStack>

        <Menu>
          <MenuButton
            as={Button}
            display={{ base: 'inline-flex', md: 'none' }}
            variant="outline"
            color="white"
            aria-label="Open navigation menu"
          >
            Menu
          </MenuButton>
          <MenuList color="gray.800">
            <MenuItem as={RouterLink} to="/courses">Catalog</MenuItem>
            {user?.role === 'student' && <>
              <MenuItem as={RouterLink} to="/dashboard">Dashboard</MenuItem>
              <MenuItem as={RouterLink} to="/my-courses">My Courses</MenuItem>
            </>}
            {user?.role === 'admin' && <>
              <MenuItem as={RouterLink} to="/admin/dashboard">Admin Dashboard</MenuItem>
              <MenuItem as={RouterLink} to="/admin/courses">Manage Courses</MenuItem>
            </>}
          </MenuList>
        </Menu>

        {/* Right Side: User Actions / Login */}
        <Flex alignItems="center">
          {user ? (
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                <HStack spacing={3}>
                  {/* FIXED: Reading 'name' instead of 'username' from the API */}
                  <Text display={{ base: 'none', md: 'block' }} color="white" fontWeight="medium">
                    {user.name}
                  </Text>
                  {/* Avatar automatically generates initials from the user's name */}
                  <Avatar size="sm" name={user.name} bg="teal.500" color="white" />
                </HStack>
              </MenuButton>
              <MenuList color="gray.800" shadow="lg">
                <MenuItem as={RouterLink} to={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} color="red.500" fontWeight="bold">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={4}>
              <Button as={RouterLink} to="/login" variant="ghost" color="white" _hover={{ bg: 'whiteAlpha.200' }}>
                Sign In
              </Button>
              <Button as={RouterLink} to="/register" colorScheme="teal">
                Sign Up
              </Button>
            </HStack>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;