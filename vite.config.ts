import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import replace from '@rollup/plugin-replace';
import fis3 from './scripts/fis3plugin';
import markdown from './scripts/markdownPlugin';
import mockApi from './scripts/mockApiPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    fis3(),
    markdown(),
    mockApi(),

    react({
      babel: {
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties']
        }
      }
    }),
    svgr({
      exportAsDefault: true,
      svgrOptions: {
        svgProps: {
          className: 'icon'
        },
        prettier: false,
        dimensions: false
      }
    }),
    monacoEditorPlugin({})
  ],
  optimizeDeps: {
    include: ['amis-formula/lib/doc'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    port: 8888
  },
  resolve: {
    alias: [
      {
        find: 'amis-formula/lib',
        replacement: path.resolve(__dirname, './packages/amis-formula/src')
      },
      {
        find: 'amis-formula',
        replacement: path.resolve(__dirname, './packages/amis-formula/src')
      },
      {
        find: 'amis-ui/lib',
        replacement: path.resolve(__dirname, './packages/amis-ui/src')
      },
      {
        find: 'amis-ui',
        replacement: path.resolve(__dirname, './packages/amis-ui/src')
      },
      {
        find: 'amis-core',
        replacement: path.resolve(__dirname, './packages/amis-core/src')
      },
      {
        find: 'amis',
        replacement: path.resolve(__dirname, './packages/amis/src')
      }
    ]
  }
});
