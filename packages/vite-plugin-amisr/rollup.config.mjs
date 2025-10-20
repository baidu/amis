import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import path from 'path';

// 读取 package.json 获取依赖列表
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/index.ts', // 入口文件
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: 'index.cjs.js'
    },
    {
      dir: 'dist',
      format: 'es',
      entryFileNames: 'index.esm.js'
    }
  ],
  // 将所有依赖项标记为外部依赖，不打包进最终代码
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'path'
  ],
  plugins: [
    resolve(), // 解析第三方依赖
    commonjs(), // 将 CommonJS 模块转换为 ES6
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    })
  ]
};
