// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import license from 'rollup-plugin-license';
import autoExternal from 'rollup-plugin-auto-external';
import replace from '@rollup/plugin-replace';
import {
  name,
  version,
  author,
  main,
  module,
  dependencies
} from './package.json';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

const settings = {
  globals: {}
};

const external = id => {
  const result = new RegExp(
    `^(?:${Object.keys(dependencies)
      .concat([
        'react',
        'react-dom',
        'react-overlays',
        'warning',
        'tslib',
        'dom-helpers',
        '@restart/hooks',
        'entities',
        'linkify-it',
        'markdown-it',
        'prop-types',
        'markdown-it-html5-media',
        'mdurl',
        'uc.micro'
      ])
      .map(value =>
        value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
      )
      .join('|')})`
  ).test(id);

  if (!result && ~id.indexOf('node_modules')) {
    console.log(id);
  }

  return result;
};
const input = './src/index.tsx';

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
    input,

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
  },

  isDev
    ? null
    : {
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
].filter(item => item);

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
  const overridePaths = ['amis-formula'].reduce(
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
    transpileDynamicImportForCJS(),
    autoExternal(),
    json(),
    resolve({
      jsnext: true,
      main: true
    }),
    replace({
      'preventAssignment': true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__buildDate__': () => JSON.stringify(new Date()),
      '__buildVersion': JSON.stringify(version)
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
