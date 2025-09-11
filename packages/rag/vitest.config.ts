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
        // Exclude config and meta files from coverage to avoid false 0% entries
        '**/vitest.config.*',
        '**/vite.config.*',
        '**/tsconfig*.json',
        '**/*.test.*',
        '**/tests/**'
      ]
    }
  }
});
