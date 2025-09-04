// Flat config for ESLint v9+
import js from '@eslint/js';
import ts from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.svelte-kit/**',
      '**/build/**',
      '**/node_modules/**',
      '**/coverage/**',
      '.turbo/**',
      '.vercel/**',
      '.pnpm-store/**'
    ]
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports
    },
    languageOptions: {
      parser: ts.parser,
      parserOptions: { ecmaVersion: 2023, sourceType: 'module' }
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': ['warn', { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'import/order': ['warn', {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [['builtin','external'], ['internal'], ['parent','sibling','index'], ['type']]
      }],
      'import/no-self-import': 'error',
      'import/no-cycle': ['warn', { maxDepth: 1 }],
      'no-restricted-imports': ['error', { patterns: ['@roler/*/src/*', '@roler/*/dist/*'] }]
    }
  },
  {
    files: ['**/*.{test,spec}.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-extraneous-dependencies': 'off'
    }
  }
];