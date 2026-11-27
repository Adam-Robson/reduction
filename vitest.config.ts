import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['dotenv/config'],
    include: ['**/__tests__/**/*.test.ts?(x)']
  }
});
