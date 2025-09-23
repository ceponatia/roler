// packages/docs-site/babel.config.cjs
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
    // Critical for "import/export may appear only with sourceType: module" errors
    sourceType: 'unambiguous',
    // Ensure only this root config is used
    babelrc: false, // Ensure only this root config is used
  };
};
