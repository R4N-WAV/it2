import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { brukTema, lesTema } from './theme';

brukTema(lesTema()); // før første tegning, så skjermen ikke blinker lyst i mørk modus

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
