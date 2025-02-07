import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  formatters: true,
  react: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  stylistic: {
    semi: false,
  },
  lessOpinionated: true,
}, {
  files: ['fix-markdown.mjs', 'sync-version.mjs'],
  rules: {
    'no-console': 'off',
  },
})
