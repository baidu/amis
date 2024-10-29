import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import replace from '@rollup/plugin-replace';
import fis3 from './scripts/fis3plugin';
import markdown from './scripts/markdownPlugin';
import mockApi from './scripts/mockApiPlugin';
import transformMobileHtml from './scripts/transformMobileHtml';
//@ts-ignore
import i18nPlugin from 'plugin-react-i18n';
import i18nConfig from './i18nConfig';

var I18N = process.env.I18N;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    I18N && i18nPlugin(i18nConfig),

    fis3(),
    markdown(),
    mockApi(),
    transformMobileHtml(),

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
    monacoEditorPlugin({}),
    replace({
      __editor_i18n: !!I18N,
      preventAssignment: true
    })
  ].filter(n => n),
  optimizeDeps: {
    include: ['amis-formula/lib/doc'],
    exclude: ['amis-core', 'amis-formula', 'amis', 'amis-ui'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8888
  },
  resolve: {
    alias: [
      {
        find: 'moment/locale',
        replacement: 'moment/dist/locale'
      },
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
        find: 'amis/lib',
        replacement: path.resolve(__dirname, './packages/amis/src')
      },
      {
        find: 'amis/schema.json',
        replacement: path.resolve(__dirname, './packages/amis/schema.json')
      },
      {
        find: 'amis',
        replacement: path.resolve(__dirname, './packages/amis/src')
      },
      {
        find: 'amis-editor',
        replacement: path.resolve(__dirname, './packages/amis-editor/src')
      },
      {
        find: 'amis-editor-core',
        replacement: path.resolve(__dirname, './packages/amis-editor-core/src')
      },
      {
        find: 'office-viewer',
        replacement: path.resolve(__dirname, './packages/office-viewer/src')
      },
      {
        find: 'amis-theme-editor-helper',
        replacement: path.resolve(
          __dirname,
          './packages/amis-theme-editor-helper/src'
        )
      }
    ]
  }
});
