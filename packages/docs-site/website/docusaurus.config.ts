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
		locales: ['en']
	},
	staticDirectories: ['static'],
		presets: [
			[
				require.resolve('@docusaurus/preset-classic'),
			{
				docs: {
					path: '../docs',
					routeBasePath: '/docs',
					sidebarPath: require.resolve('./sidebars'),
					docItemComponent: '@theme/ApiItem'
				}
			}
		]
		],
		themes: [require.resolve('docusaurus-theme-openapi-docs')],
		plugins: [
			[
				require.resolve('docusaurus-plugin-openapi-docs'),
				{
					id: 'openapi',
					docsPluginId: 'classic',
					config: {
						roler: {
							specPath: '../openapi.json',
							outputDir: '../docs/openapi',
							sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' }
						}
					}
				}
			]
		],
		themeConfig: {
			navbar: {
				title: 'Roler Docs',
				items: [
					{ type: 'docSidebar', sidebarId: 'apiSidebar', position: 'left', label: 'API (TS)' },
					{ type: 'docSidebar', sidebarId: 'openapiSidebar', position: 'left', label: 'OpenAPI' }
				]
			}
		}
};
