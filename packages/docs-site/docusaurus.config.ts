export default {
  title: 'Roler Docs',
  url: 'https://ceponatia.github.io',
  baseUrl: '/roler/',
  favicon: 'img/favicon.ico',
  organizationName: 'ceponatia',
  projectName: 'roler',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  staticDirectories: ['static'],

  presets: [
    [
      'classic',
      {
        docs: {
          // ⬅️ was '../docs' when the site lived in /website
          path: 'docs',
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
          // you’re using typedoc markdown; keep ApiItem if that’s intentional
          docItemComponent: '@theme/ApiItem',
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs'],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'openapi',
        // Match the docs plugin id emitted by the classic preset (default)
        docsPluginId: 'default',
        config: {
          roler: {
            // ⬅️ both paths now local to the package root
            specPath: 'openapi.json',
            outputDir: 'docs/openapi',
            sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' },
          },
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Roler Docs',
      items: [
        { type: 'docSidebar', sidebarId: 'apiSidebar', position: 'left', label: 'API (TS)' },
        { type: 'docSidebar', sidebarId: 'openapiSidebar', position: 'left', label: 'OpenAPI' },
        { to: '/docs/api/', label: 'Docs Home', position: 'left' },
      ],
    },
  },
};
