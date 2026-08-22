import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  // Some dependencies reference the Node `process` global at runtime,
  // assuming a webpack-bundled environment where it's always defined.
  // Vite doesn't polyfill this the way webpack's DefinePlugin did. esbuild's
  // `define` only accepts a plain identifier or literal as the replacement
  // (an inline object/function expression errors with "must be an entity
  // name or JS literal"), so this points every `process` reference at a
  // real global instead, polyfilled in index.html.
  // Also aliases the Node `global` object to `globalThis`, for the same
  // reason (e.g. js-sha3 references it directly, assuming Node/webpack).
  define: {
    process: 'globalThis.process',
    global: 'globalThis',
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  // The app has JSX in plain .js files (a create-react-app convention),
  // rather than .jsx. Production builds skip @vitejs/plugin-react's babel
  // pass entirely when there's nothing babel-specific to do (no Fast
  // Refresh at build time), so the actual JSX stripping for these files
  // falls to Vite's own esbuild transform step. That step's file filter
  // defaults to *excluding* bare .js (createFilter(include, exclude),
  // with a default exclude of /\.js$/) — include alone doesn't override
  // that default exclude, so both need to be set explicitly.
  esbuild: {
    include: /\.(js|jsx|ts|tsx)$/,
    exclude: [],
    loader: 'jsx',
  },
  // The dependency pre-bundling *scan* (run once at dev server startup to
  // find which npm packages to pre-bundle) uses its own separate esbuild
  // config, not the one above — without this it fails to parse the app's
  // own .js-with-JSX files while walking the import graph, silently falls
  // back to bundling dependencies on demand instead, and that fallback
  // mode re-triggers on every newly-discovered dependency, which is what
  // caused the repeated "Outdated Optimize Dep" 504s.
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
      // The top-level `define` above only reaches the app's own source
      // files. Dependency pre-bundling runs through a separate esbuild
      // invocation with its own options, so it needs the same define
      // repeated here to actually take effect on bundled dependencies.
      define: {
        process: 'globalThis.process',
        global: 'globalThis',
      },
    },
  },
})
