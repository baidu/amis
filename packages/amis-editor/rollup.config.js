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
import fs from 'fs';
import svgr from '@svgr/rollup';
import i18nPlugin from 'plugin-react-i18n';
import moment from 'moment';

const i18nConfig = require('./i18nConfig');

const settings = {
  globals: {},
  commonConfig: {}
};

const pkgs = [];
// 读取所有的node_modules目录，获取所有的包名
[
  path.join(__dirname, './node_modules'),
  path.join(__dirname, '../../node_modules')
].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(item => {
      if (item.startsWith('.')) {
        return;
      }

      if (item.startsWith('@')) {
        fs.readdirSync(path.join(dir, item)).forEach(subItem => {
          pkgs.push(item + '/' + subItem);
        });
      }

      return pkgs.push(item);
    });
  }
});
const external = id =>
  pkgs.some(pkg => id.startsWith(pkg) || ~id.indexOf(`node_modules/${pkg}`));
const input = './src/index.tsx';

export default [
  {
    input,

    output: [
      {
        ...settings,
        ...settings.commonConfig,
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
        ...settings.commonConfig,
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
        right:
          ', "tslib"], function(mod, tslib) {fullfill(tslib.__importStar(mod))})})})'
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
  const typeScriptOptions = {
    typescript: require('typescript'),
    sourceMap: false,
    outputToFilesystem: true,
    ...(format === 'esm'
      ? {
          compilerOptions: {
            rootDir: './src',
            outDir: path.dirname(module)
          }
        }
      : {
          compilerOptions: {
            rootDir: './src',
            outDir: path.dirname(main)
          }
        })
  };

  return [
    i18nPlugin(i18nConfig),
    typescript(typeScriptOptions),
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
    commonjs({
      sourceMap: false
    }),
    license({
      banner: `
        ${name} v${version}
        build time: <%=moment().format('YYYY-MM-DD')%>
        Copyright 2018<%= moment().format('YYYY') > 2018 ? '-' + moment().format('YYYY') : null %> ${author}
      `
    }),
    onRollupError(error => {
      console.warn(`[构建异常]${error}`);
      // 构建异常时，删除 tsconfig.tsbuildinfo
      fs.unlink(path.resolve(__dirname, 'tsconfig.tsbuildinfo'), () => {
        console.info(
          '[构建异常]已自动删除tsconfig.tsbuildinfo，请重试构建命令。'
        );
      });
    })
  ];
}

function onRollupError(callback = () => {}) {
  return {
    name: 'onerror',
    buildEnd(err) {
      if (err) {
        callback(err);
      }
    }
  };
}
