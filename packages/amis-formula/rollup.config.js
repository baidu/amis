// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import license from 'rollup-plugin-license';
import {
  name,
  version,
  main,
  module,
  author,
  dependencies
} from './package.json';
import path from 'path';
import fs from 'fs';

const settings = {
  globals: {}
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

export default [
  {
    input: ['./src/index.ts'],
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
    external: external,
    plugins: getPlugins('cjs')
  },
  {
    input: ['./src/index.ts'],
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
    external: external,
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
    transpileDynamicImportForCJS(),
    json(),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    typescript(typeScriptOptions),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js'],
      ignoreGlobal: false,
      sourceMap: false
    }),
    license({
      banner: `
        ${name} v${version}
        Copyright 2021<%= moment().format('YYYY') > 2021 ? '-' + moment().format('YYYY') : null %> ${author}
      `
    })
  ];
}
