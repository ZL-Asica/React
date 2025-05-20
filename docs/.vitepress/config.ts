import type { DefaultTheme, UserConfig } from 'vitepress'

import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

import pkg from '../../package.json' with { type: 'json' }

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
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }],
  ],
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
    sidebar: {
      '/': [
        {
          text: 'Documentation',
          items: [
            { text: 'Introduction', link: '/' },
            { text: 'Guide', link: '/guide' },
          ],
        },
      ],
    },
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
  },
  ignoreDeadLinks: true,
}

export default defineConfig(
  withSidebar(vitePressConfig, [
    {
      documentRootPath: 'docs',
      scanStartPath: 'guide',
      basePath: '/guide/',
      resolvePath: '/guide/',
      useTitleFromFileHeading: true,
      rootGroupText: 'Guide',
    },
    {
      documentRootPath: 'docs',
      scanStartPath: 'docs',
      resolvePath: '/docs/',
      useTitleFromFileHeading: true,
      rootGroupText: 'Documentation',
      useFolderLinkFromIndexFile: true,
    },
  ]),
)
