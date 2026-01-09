import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import path from 'path';

export default defineConfig({
  plugins: [
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        exportType: 'default',
        icon: true
      }
    }),
    react({
      babel: {
        plugins: [
          // TypeScript transform MUST come first to handle 'declare' fields
          [
            '@babel/plugin-transform-typescript',
            {
              isTSX: true,
              allowDeclareFields: true
            }
          ],
          ['@babel/plugin-proposal-decorators', {legacy: true}],
          ['@babel/plugin-transform-class-properties', {loose: true}]
        ],
        parserOpts: {
          plugins: ['decorators-legacy', 'classProperties']
        }
      },
      // Only apply babel to .tsx files
      include: ['**/*.tsx', '**/*.ts']
    }),
    // Monaco Editor 插件 - 处理 Web Worker
    monacoEditorPlugin({
      languageWorkers: [
        'editorWorkerService',
        'json',
        'css',
        'html',
        'typescript'
      ]
    }) as any
  ],
  resolve: {
    alias: [
      // 特殊文件路径
      {
        find: 'amis/schema.json',
        replacement: path.resolve(__dirname, '../amis/schema.json')
      },
      // lib 路径映射到 src (更具体的路径优先)
      {
        find: 'amis-core/lib',
        replacement: path.resolve(__dirname, '../amis-core/src')
      },
      {
        find: 'amis-ui/lib',
        replacement: path.resolve(__dirname, '../amis-ui/src')
      },
      {
        find: 'amis-formula/lib',
        replacement: path.resolve(__dirname, '../amis-formula/src')
      },
      {find: 'amis/lib', replacement: path.resolve(__dirname, '../amis/src')},
      {
        find: 'amis-editor-core/lib',
        replacement: path.resolve(__dirname, '../amis-editor-core/src')
      },
      // 源码路径别名
      {
        find: 'amis-core',
        replacement: path.resolve(__dirname, '../amis-core/src')
      },
      {find: 'amis-ui', replacement: path.resolve(__dirname, '../amis-ui/src')},
      {
        find: 'amis-formula',
        replacement: path.resolve(__dirname, '../amis-formula/src')
      },
      {find: 'amis', replacement: path.resolve(__dirname, '../amis/src')},
      {
        find: 'amis-editor-core',
        replacement: path.resolve(__dirname, '../amis-editor-core/src')
      },
      {
        find: 'amis-theme-editor-helper',
        replacement: path.resolve(__dirname, '../amis-theme-editor-helper/src')
      }
    ]
  },
  server: {
    port: 3000,
    open: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'mobx',
      'mobx-react',
      'mobx-state-tree',
      'monaco-editor'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        useDefineForClassFields: false,
        experimentalDecorators: true
      }
    }
  },
  define: {
    __editor_i18n: JSON.stringify(false)
  },
  worker: {
    format: 'es'
  }
});
