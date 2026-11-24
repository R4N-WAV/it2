import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { brukTema, lesTema } from './theme';
import { startAutoSynk } from './rea/synk';

brukTema(lesTema()); // før første tegning, så skjermen ikke blinker lyst i mørk modus

// Offline etter første oppstart (bare i produksjonsbygget).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => undefined); });
}

startAutoSynk();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
