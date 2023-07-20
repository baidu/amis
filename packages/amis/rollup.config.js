// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import license from 'rollup-plugin-license';
import autoExternal from 'rollup-plugin-auto-external';
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

const external = id => {
  const result = new RegExp(
    `^(?:${Object.keys(dependencies)
      .concat([
        'monaco-editor',
        'react',
        'react-dom',
        'rc-input-number',
        '@rc-component/mini-decimal',
        '@babel/runtime'
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

// 参考：https://github.com/theKashey/jsx-compress-loader/blob/master/src/index.js
function transpileReactCreateElement() {
  return {
    name: 'transpile-react-create-element',
    enforce: 'post',
    transform: (code, id) => {
      if (
        /\.(?:tsx|jsx|svg)$/.test(id) &&
        code.indexOf('React.createElement') !== -1
      ) {
        const separator = '\n\n;';
        const appendText =
          `\n` +
          `var __react_jsx__ = require('react');\n` +
          `var _J$X_ = (__react_jsx__["default"] || __react_jsx__).createElement;\n` +
          `var _J$F_ = (__react_jsx__["default"] || __react_jsx__).Fragment;\n`;

        const newSource = code
          .replace(/React\.createElement\(/g, '_J$X_(')
          .replace(/React\.createElement\(/g, '_J$F_(');

        code = [appendText, newSource].join(separator);
      }

      return {
        code
      };
    }
  };
}

function getPlugins(format = 'esm') {
  const overridePaths = [
    'amis-formula',
    'amis-core',
    'amis-ui',
    'office-viewer'
  ].reduce(
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
    ,
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
    format === 'esm' ? null : transpileReactCreateElement(),
    license({
      banner: `
        ${name} v${version}
        Copyright 2018<%= moment().format('YYYY') > 2018 ? '-' + moment().format('YYYY') : null %> ${author}
      `
    })
  ].filter(item => item);
}
