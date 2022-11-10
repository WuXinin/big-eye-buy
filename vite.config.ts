import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        GlobalsPolyfills({
          process: true,
          buffer: true,
        }),
        // NodeModulesPolyfills(),
      ],
    },
  },  
  plugins: [
    react(),
    svgr({
      exportAsDefault: true,
      svgrOptions: {
        dimensions: true,
        svgoConfig: {
          removeViewBox: false
        }
      }
    }),
  ],
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: 'util',
      http: 'agent-base',      
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      esmExternals: true 
    },
  }  
})
