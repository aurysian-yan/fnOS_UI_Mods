import { createRoot } from 'react-dom/client';
import { App } from './App';
import './popup.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Missing #root container for popup app');
}

createRoot(container).render(<App />);
