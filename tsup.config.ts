import { defineConfig } from 'tsup'

export default defineConfig([
  // ── 1) Utils bundle (Server)
  {
    name: 'utils',
    entry: ['src/utils/index.ts'],
    platform: 'node',
    format: ['esm'],
    outDir: 'dist/utils',
    dts: true,
    clean: true,
    treeshake: true,
    sourcemap: false,
  },

  // ── 2) Hooks bundle (Client)
  {
    name: 'hooks',
    entry: ['src/hooks/index.ts'],
    platform: 'browser',
    format: ['esm'],
    outDir: 'dist/hooks',
    dts: true,
    clean: true,
    treeshake: true,
    sourcemap: false,
  },

  // ── 3) (Optional) Root/index bundle
  {
    name: 'main',
    entry: ['src/index.ts'],
    platform: 'node',
    format: ['esm'],
    outDir: 'dist',
    dts: true,
    clean: false,
    treeshake: true,
    sourcemap: false,
  },
])
