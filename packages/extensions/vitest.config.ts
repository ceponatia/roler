import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  setupFiles: ['test-utils/setup-tests.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
    },
  },
});
