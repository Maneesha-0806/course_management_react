import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#e6fffa',
      100: '#b2f5ea',
      200: '#81e6d9',
      300: '#4fd1c5',
      400: '#38b2ac',
      500: '#319795',
      600: '#2c7a7b',
      700: '#285e61',
      800: '#234e52',
      900: '#1d4044',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      'html, body, #root': { minHeight: '100%' },
      body: { bg: 'gray.950', color: 'gray.100' },
      '*::selection': { bg: 'brand.500', color: 'white' },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          bg: 'gray.800',
          borderColor: 'whiteAlpha.200',
          borderWidth: '1px',
        },
      },
    },
    Button: { defaultProps: { colorScheme: 'brand' } },
    Input: { defaultProps: { focusBorderColor: 'brand.400' } },
    Textarea: { defaultProps: { focusBorderColor: 'brand.400' } },
  },
});

export default theme;
