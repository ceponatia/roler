import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['test-utils/setup-tests.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'lcov'],
      exclude: [
        'dist/**',
        'coverage/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        'src/**/__tests__/**',
        'vitest.config.ts'
      ]
    },
  },
});
