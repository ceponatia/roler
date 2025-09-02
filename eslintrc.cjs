// .eslintrc.cjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    // Do NOT set "project" here; package-level configs handle type-aware rules
  },
  env: { es2023: true, node: true },
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier' // keep last
  ],
  settings: {
    // Ensure import plugin understands TS files & path aliases
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        // Looks up tsconfigs in each package; supports path aliases
        alwaysTryTypes: true
      },
      // Optional: also allow Node-style resolution
      node: { extensions: ['.js', '.cjs', '.mjs', '.ts', '.tsx'] }
    }
  },
  rules: {
    // Keep TS strict but pragmatic
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': ['warn', { args: 'after-used', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // Import hygiene
    'import/order': ['warn', {
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
      groups: [['builtin','external'], ['internal'], ['parent','sibling','index'], ['type']]
    }],
    'import/no-self-import': 'error',
    'import/no-cycle': ['warn', { maxDepth: 1 }],

    // Monorepo boundary (adjust scope to your namespace)
    'no-restricted-imports': ['error', {
      patterns: ['@roler/*/src/*', '@roler/*/dist/*'] // prevent deep imports across packages
    }],
  },
  ignorePatterns: [
    '**/dist/**',
    '**/.svelte-kit/**',
    '**/build/**',
    '**/node_modules/**',
    '**/coverage/**',
    '.turbo/**',
    '.vercel/**',
    '.pnpm-store/**'
  ],
  overrides: [
    // Config files (CJS, Node context)
    {
      files: ['**/*.config.{js,cjs,mjs,ts}'],
      env: { node: true },
      rules: { 'import/no-extraneous-dependencies': 'off' }
    },
    // Tests (Vitest/Jest)
    {
      files: ['**/*.{test,spec}.ts'],
      env: { node: true },
      // If using Vitest:
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-extraneous-dependencies': 'off'
      }
    },
    // Svelte (only if you lint .svelte files)
    {
      files: ['**/*.svelte'],
      processor: 'svelte-eslint-parser/svelte',
      plugins: ['svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.svelte']
      },
      extends: ['plugin:svelte/recommended', 'prettier'],
      rules: {
        // Keep these light; Prettier handles formatting
      }
    }
  ]
};