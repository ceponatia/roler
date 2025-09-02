// prettierrc.cjs
module.exports = {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'all',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  overrides: [
    { files: '*.svelte', options: { parser: 'svelte' } }
  ]
};