import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.ts'],
    environment: 'node',
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'lcov'],
      // Exclude test files and config from coverage to focus on source schemas only
      exclude: [
        'dist/**',
        'coverage/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        'src/**/__tests__/**',
        'vitest.config.ts'
      ]
    }
  }
});
