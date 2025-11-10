import { defineConfig } from 'tsdown'

export default defineConfig([
  // ── 1) Utils bundle (Server)
  {
    exports: false,
    name: 'utils',
    entry: ['src/utils/index.ts'],
    format: ['esm'],
    outDir: 'dist/utils',
    dts: {
      oxc: true,
    },
    sourcemap: true,
    clean: true,
    platform: 'neutral',
  },

  // ── 2) Hooks bundle (Client)
  {
    exports: false,
    name: 'hooks',
    entry: ['src/hooks/index.ts'],
    format: ['esm'],
    outDir: 'dist/hooks',
    dts: {
      oxc: true,
    },

    sourcemap: true,
    clean: true,
    platform: 'browser',
  },

  // ── 3) Root/index bundle
  {
    exports: false,
    name: 'main',
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'dist',
    dts: {
      oxc: true,
    },
    sourcemap: true,
    clean: true,
    platform: 'neutral',
  },
])
