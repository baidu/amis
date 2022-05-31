// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';
import {name, version, main, module, browser, author} from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const isForLib = process.env.NODE_ENV === 'lib';


const settings = {
  globals: {
    lodash: 'lodash',
    moment: 'moment',
    tslib: 'tslib'
  }
};

export default {
  input: isForLib ? './scripts/lib.ts' : './src/index.ts',
  output: [
    {
      file: isForLib ? 'dist/formula.js' : main,
      name: isForLib ? 'formula' : main,
      ...settings,
      format: isForLib ? 'iife' : 'cjs',
      plugins: [
        isForLib && terser()
      ],
      strict: !isForLib,
      footer: isForLib ? `var evaluate = formula.evaluate;
      var momentFormat = formula.momentFormat;
      var parse = formula.parse;` : '',
    }
    // {
    //   file: module,
    //   ...settings,
    //   name: name,
    //   format: 'es'
    // },
    // {
    //   file: browser,
    //   ...settings,
    //   name: name,
    //   format: 'umd'
    // }
  ],
  external: isForLib ? [] : [
    'lodash',
    'lodash/transform',
    'lodash/groupBy',
    'lodash/uniqBy',
    'lodash/uniq',
    'lodash/isPlainObject',
    'lodash/padStart',
    'lodash/upperFirst',
    'lodash/capitalize',
    'lodash/escape',
    'lodash/truncate',
    'moment',
    'tslib'
  ],

  plugins: [
    json(),
    resolve({
      jsnext: true,
      main: true,
      browser: true
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
        Copyright 2021<%= moment().format('YYYY') > 2021 ? '-' + moment().format('YYYY') : null %> ${author}
      `
    })
  ]
};
