import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { App } from './App';
import './popup.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Missing #root container for popup app');
}

createRoot(container).render(
  <ChakraProvider resetCSS={false}>
    <App />
  </ChakraProvider>
);
