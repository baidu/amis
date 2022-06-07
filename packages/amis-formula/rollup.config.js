// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';
import {name, version, main, author, dependencies} from './package.json';
import path from 'path';

const isForLib = process.env.NODE_ENV === 'lib';

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

export default {
  input: isForLib ? './scripts/lib.ts' : './src/index.ts',
  output: [
    {
      file: isForLib ? 'lib/formula.js' : main,
      name: isForLib ? 'formula' : main,
      ...settings,
      format: isForLib ? 'iife' : 'cjs',
      plugins: [isForLib && terser()],
      strict: !isForLib,
      footer: isForLib
        ? `var evaluate = formula.evaluate;
      var momentFormat = formula.momentFormat;
      var parse = formula.parse;`
        : ''
    }
  ],
  external: isForLib ? [] : external,

  plugins: [
    json(),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    typescript({
      typescript: require('typescript'),
      sourceMap: false,
      outputToFilesystem: true
    }),
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
  ]
};
