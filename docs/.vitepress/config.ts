import type { DefaultTheme, UserConfig } from 'vitepress'

import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

import pkg from '../../package.json' with { type: 'json' }

const docsSidebar: DefaultTheme.Sidebar = generateSidebar([
  {
    documentRootPath: 'docs', // .vitepress directory
    scanStartPath: 'docs', // Scan files under docs/docs
    resolvePath: '/docs/', // Generated link prefix => /docs/...
    useTitleFromFileHeading: true,
    useFolderLinkFromIndexFile: true,
    rootGroupText: 'Documentation',
  },
])

// https://vitepress.dev/reference/site-config
const vitePressConfig: UserConfig<DefaultTheme.Config> = {
  lang: 'en-US',
  title: '@zl-asica/react',
  description: 'A collection of reusable React hooks and utilities.',
  cleanUrls: true,
  head: [
    ['meta', { name: 'keywords', content: 'react, hooks, utilities, zl-asica' }],
    ['meta', { name: 'author', content: 'ZL Asica' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  transformPageData(pageData) {
    const rel = pageData.relativePath

    // Only keep index of /api/. Hide all other /api/** editLink
    // if (rel?.startsWith('docs') && !rel.endsWith('index.md')) {
    if (rel?.startsWith('docs')) {
      pageData.frontmatter = {
        ...pageData.frontmatter,
        editLink: false,
        lastUpdated: false,
      }
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Docs', link: '/docs/' },
      { text: `v${pkg.version}`, items: [
        { text: 'Changelog', link: 'https://github.com/ZL-Asica/React/blob/main/CHANGELOG.md' },
      ] },
    ],
    socialLinks: [
      { icon: 'jsr', link: 'https://jsr.io/@zl-asica/react' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@zl-asica/react' },
      { icon: 'github', link: 'https://github.com/ZL-Asica/react' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright &copy; 2024-Present <a href="https://zla.pub" target="_blank">ZL Asica</a>',
    },
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Server-Side Rendering (SSR)', link: '/guide/ssr' },
          ],
        },
      ],
      ...docsSidebar,
    },
    editLink: {
      pattern: ({ filePath }) => {
        const base = 'https://github.com/ZL-Asica/React/edit/main/docs'

        // // `filePath` should be "docs/index.html"
        // const isAPIIndex = filePath.startsWith('docs/') && filePath.endsWith('index.md')

        // if (isDocsIndex) {
        //   // Index files live directly under `docs/` as `api.index.md`
        //   return `${base}/api.index.md`
        // }

        // files in `guide` folder map directly
        // Other files are generated, should not be able to be edited.
        // handled by `transformPageData` above.
        return `${base}/${filePath}`
      },
    },
  },
  lastUpdated: true,
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://react.zla.app',
  },
}

export default defineConfig(vitePressConfig)
