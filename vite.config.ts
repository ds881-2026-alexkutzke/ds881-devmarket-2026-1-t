import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ds881-devmarket-2026-1-t/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', 
    include: [
      'src/tests/architecture/**/*.test.ts', 
      'src/tests/hooks/**/*.test.ts'         
    ],
  },
});