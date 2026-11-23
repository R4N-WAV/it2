import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' gjør at appen virker både lokalt og under https://<bruker>.github.io/it2/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 2000 }, // alt innhold i én pakke = virker offline uten ekstra nedlastinger
});
