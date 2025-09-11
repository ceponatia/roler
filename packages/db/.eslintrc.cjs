/**
 * Local ESLint config for @roler/db.
 * Inherits root config via flat config, but we still exclude Prisma artifacts.
 */
module.exports = {
  root: false,
  ignorePatterns: ['dist/**', 'coverage/**', 'prisma/**'],
};
