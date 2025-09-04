import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/src/**/*.{test,spec}.ts'],
    environment: 'node',
    reporters: 'default',
    coverage: {
      enabled: false
    }
  }
});
