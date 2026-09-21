import { Box, Container, Text } from '@chakra-ui/react';

const Footer = () => (
  <Box as="footer" bg="gray.900" borderTopWidth="1px" borderColor="whiteAlpha.200" mt={16} py={6}>
    <Container maxW="container.xl">
      <Text textAlign="center" color="gray.500" fontSize="sm">
        © {new Date().getFullYear()} AcademiaX. All rights reserved.
      </Text>
    </Container>
  </Box>
);

export default Footer;