import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' gjør at appen virker både lokalt og under https://<bruker>.github.io/it2/
export default defineConfig({
  base: './',
  plugins: [react()],
});
