import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local dev only. In Google AI Studio, process.env.API_KEY is injected automatically.
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY ?? process.env.API_KEY ?? ''),
  },
});
