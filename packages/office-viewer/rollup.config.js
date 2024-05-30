// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import {main, module, dependencies, peerDependencies} from './package.json';
import path from 'path';

const settings = {
  globals: {}
};

const external = id =>
  new RegExp(
    `^(?:${Object.keys({...dependencies, ...peerDependencies})
      .concat([])
      .map(value =>
        value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
      )
      .join('|')})`
  ).test(id);

function outputFile(fileName, format) {
  return {
    input: [fileName],
    output: [
      {
        ...settings,
        dir: format === 'cjs' ? path.dirname(main) : path.dirname(module),
        format: format,
        exports: 'named',
        preserveModulesRoot: './src',
        preserveModules: true // Keep directory structure and files
      }
    ],
    external: external,
    plugins: getPlugins(format)
  };
}

export default [
  outputFile('./src/index.ts', 'cjs'),
  outputFile('./src/index.ts', 'esm')
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
    })
  ];
}
