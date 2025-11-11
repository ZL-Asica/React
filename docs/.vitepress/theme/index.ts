// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import DocAfter from './components/DocAfter.vue'
import NotFound from './components/NotFound.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      DefaultTheme.Layout,
      { class: 'zla-layout' },
      {
        'doc-after': () => h(DocAfter),
        'not-found': () => h(NotFound),
      },
    )
  },
  // enhanceApp({ app, router, siteData }) {
  //   // ...
  // },
} satisfies Theme
