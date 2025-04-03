// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import license from 'rollup-plugin-license';
import autoExternal from 'rollup-plugin-auto-external';
import {name, version, author, main, module} from './package.json';
import path from 'path';
import fs from 'fs';
import svgr from '@svgr/rollup';
import babel from 'rollup-plugin-babel';

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
    format === 'esm'
      ? null
      : babel({
          exclude: 'node_modules/**',
          extensions: ['.jsx', '.tsx', '.js', '.ts'],
          plugins: [
            [
              'import',
              {
                libraryName: 'amis-ui',
                libraryDirectory: 'lib',
                camel2DashComponentName: false,
                customName: (name, file) => {
                  if (
                    ['alert', 'confirm', 'setRenderSchemaFn'].includes(name)
                  ) {
                    return `amis-ui/lib/components/Alert`;
                  } else if (['toast'].includes(name)) {
                    return `amis-ui/lib/components/Toast`;
                  } else if ('NotFound' === name) {
                    return `amis-ui/lib/components/404`;
                  } else if (['withStore', 'withRemoteConfig'].includes(name)) {
                    return `amis-ui/lib/${name}`;
                  } /* else if (name[0].toUpperCase() === name[0]) {
                    return `amis-ui/lib/components/${name}`;
                  }*/
                  return `amis-ui/lib/components/${name}`;
                }
              },
              'amis-ui'
            ]
          ]
        }),
    typescript(typeScriptOptions),
    commonjs({
      sourceMap: false
    }),
    format === 'esm' ? null : transpileReactCreateElement(),
    license({
      banner: `
        ${name} v${version}
        build time: <%=moment().format('YYYY-MM-DD')%>
        Copyright 2018<%= moment().format('YYYY') > 2018 ? '-' + moment().format('YYYY') : null %> ${author}
      `
    }),

    {
      name: 'disable-treeshake',
      transform(code, id) {
        if (/\/src\/renderers\//.test(id)) {
          // Disable tree shake for modules under `src/renderers`
          return {
            code,
            map: null,
            moduleSideEffects: 'no-treeshake'
          };
        }

        return null;
      }
    }
  ].filter(item => item);
}
