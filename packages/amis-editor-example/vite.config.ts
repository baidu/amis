import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __editor_i18n: false
  },
  plugins: [
    svgr({
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true
      },
      include: '**/*.svg'
    })
    // react({
    //   babel: {
    //     plugins: [
    //       ['@babel/plugin-proposal-decorators', {legacy: true}],
    //       ['@babel/plugin-proposal-class-properties', {loose: true}]
    //     ]
    //   }
    // })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'amis/lib': path.resolve(__dirname, '../amis/src'),
      'amis/sdk': path.resolve(__dirname, '../amis/sdk'),
      'amis/schema.json': path.resolve(__dirname, '../amis/schema.json'),
      'amis/schema-minimal.json': path.resolve(
        __dirname,
        '../amis/schema-minimal.json'
      ),
      'amis': path.resolve(__dirname, '../amis/src'),
      'amis-ui/lib': path.resolve(__dirname, '../amis-ui/src'),
      'amis-ui/scss': path.resolve(__dirname, '../amis-ui/scss'),
      'amis-ui': path.resolve(__dirname, '../amis-ui/src'),
      'amis-core/lib': path.resolve(__dirname, '../amis-core/src'),
      'amis-core': path.resolve(__dirname, '../amis-core/src'),
      'amis-editor/lib': path.resolve(__dirname, '../amis-editor/src'),
      'amis-editor': path.resolve(__dirname, '../amis-editor/src'),
      'amis-editor-core/lib': path.resolve(
        __dirname,
        '../amis-editor-core/src'
      ),
      'amis-editor-core/scss': path.resolve(
        __dirname,
        '../amis-editor-core/scss'
      ),
      'amis-editor-core': path.resolve(__dirname, '../amis-editor-core/src'),
      'amis-formula/lib': path.resolve(__dirname, '../amis-formula/src'),
      'amis-formula': path.resolve(__dirname, '../amis-formula/src')
    }
  },
  server: {
    port: 3000
  }
});
