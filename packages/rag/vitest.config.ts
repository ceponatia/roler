import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths({
      // Limit scanning to the RAG test tsconfig to avoid parsing unrelated repo configs (like gh-pages)
      projects: [new URL('./tsconfig.test.json', import.meta.url).pathname],
      ignoreConfigErrors: true
    })
  ],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        'dist/**',
        'coverage/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        'src/**/__tests__/**',
        '**/vitest.config.*',
        '**/vite.config.*',
        '**/tsconfig*.json'
      ]
    }
  }
});
