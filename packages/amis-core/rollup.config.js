// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import license from 'rollup-plugin-license';
import {name, version, main, module, author} from './package.json';

const settings = {
  globals: {}
};

export default {
  input: './src/index.ts',
  output: [
    {
      ...settings,
      dir: './dist/',
      name: name,
      format: 'cjs',
      preserveModules: true // Keep directory structure and files
    }
  ],
  external: [],

  plugins: [
    json(),
    resolve({
      jsnext: true,
      main: true
    }),
    typescript({
      typescript: require('typescript')
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
        Copyright 2018<%= moment().format('YYYY') > 2018 ? '-' + moment().format('YYYY') : null %> ${author}
      `
    })
  ]
};
