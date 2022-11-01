// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import license from 'rollup-plugin-license';
import autoExternal from 'rollup-plugin-auto-external';
import sass from 'sass';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';

import {
  name,
  version,
  author,
  main,
  module,
  dependencies
} from './package.json';
import path from 'path';
import svgr from '@svgr/rollup';

const settings = {
  globals: {}
};

const external = id =>
  new RegExp(
    `^(?:${Object.keys(dependencies)
      .concat([
        'linkify-it',
        'markdown-it',
        'markdown-it-html5-media',
        'mdurl',
        'uc.micro',
        'entities'
      ])
      .map(value =>
        value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
      )
      .join('|')})`
  ).test(id);
const input = [
  './src/index.tsx',
  './src/components/ColorPicker.tsx', // 默认不加载的需要手动维护列表，否则不会编译
  './src/components/BarCode.tsx',
  './src/components/Markdown.tsx',
  './src/components/Tinymce.tsx',
  './src/components/RichText.tsx',
  './src/components/CityDB.ts'
];

/** 获取子包编译后的入口路径，需要使用相对路径 */
const getCompiledEntryPath = (repo, format) =>
  path.join(
    '..',
    repo,
    repo === 'amis-formula' || format === 'cjs' ? 'lib' : 'esm',
    'index.js'
  );

export default [
  {
    input: input.concat([
      './scss/themes/antd.scss',
      './scss/themes/ang.scss',
      './scss/themes/cxd.scss',
      './scss/themes/dark.scss',
      './scss/themes/default.scss',
      './scss/helper.scss'
    ]),

    output: [
      {
        ...settings,
        dir: path.dirname(main),
        format: 'cjs',
        exports: 'named',
        preserveModulesRoot: './src',
        preserveModules: true // Keep directory structure and files
      }
    ],
    external,
    plugins: getPlugins('cjs')
      .concat(
        ['antd', 'ang', 'cxd', 'dark', 'default'].map(theme =>
          postcss({
            include: `**/${theme}.scss`,
            // process: processSass,
            extract: path.resolve(`lib/themes/${theme}.css`),
            plugins: [postcssImport(), autoprefixer()]
          })
        )
      )
      .concat(
        postcss({
          include: `**/helper.scss`,
          // process: processSass,
          extract: path.resolve(`lib/helper.css`),
          plugins: [postcssImport(), autoprefixer()]
        })
      )
  },

  {
    input,

    output: [
      {
        ...settings,
        dir: path.dirname(module),
        format: 'esm',
        exports: 'named',
        preserveModulesRoot: './src',
        preserveModules: true // Keep directory structure and files
      }
    ],
    external,
    plugins: getPlugins('esm')
  }
];

function transpileDynamicImportForCJS(options) {
  return {
    name: 'transpile-dynamic-import-for-cjs',
    renderDynamicImport({format, targetModuleId}) {
      if (format !== 'cjs') {
        return null;
      }

      return {
        left: 'Promise.resolve().then(function() {return new Promise(function(fullfill) {require([',
        right: '], function(mod) {fullfill(tslib.__importStar(mod))})})})'
      };

      // return {
      //   left: 'Promise.resolve().then(function() {return new Promise(function(fullfill) {require.ensure([',
      //   right:
      //     '], function(r) {fullfill(_interopDefaultLegacy(r("' +
      //     targetModuleId +
      //     '")))})})})'
      // };
    }
  };
}

function getPlugins(format = 'esm') {
  const overridePaths = ['amis-formula', 'amis-core'].reduce(
    (prev, current) => ({
      ...prev,
      [current]: [getCompiledEntryPath(current, format)]
    }),
    {}
  );
  const typeScriptOptions = {
    typescript: require('typescript'),
    sourceMap: false,
    outputToFilesystem: true,
    ...(format === 'esm'
      ? {
          compilerOptions: {
            rootDir: './src',
            outDir: path.dirname(module),
            /** 覆盖继承自顶层tsconfig的paths配置，编译时应该去掉，避免报错@rollup/plugin-typescript TS6305 */
            paths: overridePaths
          }
        }
      : {
          compilerOptions: {
            rootDir: './src',
            outDir: path.dirname(main),
            paths: overridePaths
          }
        })
  };

  return [
    svgr({
      svgProps: {
        className: 'icon'
      },
      prettier: false,
      dimensions: false
    }),
    transpileDynamicImportForCJS(),
    autoExternal(),
    json(),
    resolve({
      jsnext: true,
      main: true
    }),
    typescript(typeScriptOptions),
    commonjs({
      sourceMap: false
    }),
    license({
      banner: `
        ${name} v${version}
        Copyright 2018<%= moment().format('YYYY') > 2018 ? '-' + moment().format('YYYY') : null %> ${author}
      `
    })
  ];
}

function processSass(context, payload) {
  return new Promise((resolve, reject) => {
    sass.render(
      {
        file: context
      },
      function (err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
  });
}
