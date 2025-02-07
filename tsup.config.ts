import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: false,
  minify: true,
  esbuildPlugins: [
    preserveDirectivesPlugin({
      directives: ['use client', 'use strict'],
      include: /hooks/,
      exclude: /utils/,
    }),
  ],
})
