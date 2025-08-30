// .eslintrc.cjs (root)
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    // Do NOT set "project" here; each package/app will point to its own tsconfig for type-aware rules
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
    'import/resolver': {
      typescript: {
        // picks up tsconfig paths in each package
        alwaysTryTypes: true,
      },
    },
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

    // Monorepo boundary (adjust @app/* to your scope)
    'no-restricted-imports': ['error', {
      patterns: ['@app/*/src/*', '@app/*/dist/*']
    }],
  },
  ignorePatterns: [
    '**/dist/**',
    '**/.svelte-kit/**',
    '**/build/**',
    '**/node_modules/**'
  ]
};