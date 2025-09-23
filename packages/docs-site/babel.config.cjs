// packages/docs-site/babel.config.cjs
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
    sourceType: 'unambiguous',
  };
};