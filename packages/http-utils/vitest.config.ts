import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@roler/schemas': new URL('../schemas/src/index.ts', import.meta.url).pathname
    }
  },
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'json', 'lcov']
    }
  }
});
