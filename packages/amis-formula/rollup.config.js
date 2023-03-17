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

const settings = {
  globals: {}
};

const external = id =>
  new RegExp(
    `^(?:${Object.keys(dependencies)
      .concat([])
      .map(value =>
        value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
      )
      .join('|')})`
  ).test(id);

export default [
  {
    input: ['./src/index.ts', './src/doc.ts'],
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
    input: ['./src/index.ts', './src/doc.ts'],
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
