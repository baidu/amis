/**
 * @file fis-conf.js 配置
 */
const path = require('path');
const fs = require('fs');
const package = require('./package.json');
const parserMarkdown = require('../../scripts/md-parser');
const convertSCSSIE11 = require('../../scripts/scss-ie11');
const parserCodeMarkdown = require('../../scripts/code-md-parser');

fis.match('*.scss', {
  parser: fis.plugin('sass', {
    sourceMap: true
  }),
  rExt: '.css'
});

fis.match('/src/icons/**.svg', {
  rExt: '.js',
  isJsXLike: true,
  isJsLike: true,
  isMod: true,
  parser: [
    fis.plugin('svgr', {
      svgProps: {
        className: 'icon'
      },
      prettier: false,
      dimensions: false
    }),
    fis.plugin('typescript', {
      importHelpers: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      sourceMap: false
    })
  ]
});

fis.match('_*.scss', {
  release: false
});

fis.get('project.ignore').push('lib/**');
fis.set('project.files', ['/scss/**', '/src/**']);

fis.on('compile:end', function (file) {
  if (
    file.subpath === '/src/index.tsx' ||
    file.subpath === '/examples/mod.js'
  ) {
    file.setContent(file.getContent().replace('@version', package.version));
  }
});

fis.match('/scss/(**)', {
  release: '/$1',
  relative: true
});

fis.match('/src/(**)', {
  release: '/$1',
  relative: true
});

fis.match('/src/**.{jsx,tsx,js,ts}', {
  rExt: '.js',
  parser: [
    // docsGennerator,
    fis.plugin('typescript', {
      importHelpers: true,
      sourceMap: true,
      experimentalDecorators: true,
      esModuleInterop: true,
      allowUmdGlobalAccess: true
    }),
    function (contents) {
      return contents
        .replace(
          /(?:\w+\.)?\b__uri\s*\(\s*('|")(.*?)\1\s*\)/g,
          function (_, quote, value) {
            let str = quote + value + quote;
            return (
              '(function(){try {return __uri(' +
              str +
              ')} catch(e) {return ' +
              str +
              '}})()'
            );
          }
        )
        .replace(/\(\d+, (tslib_\d+\.__importStar)\)/g, '$1')
        .replace(
          /return\s+(tslib_\d+)\.__importStar\(require\(('|")(.*?)\2\)\);/g,
          function (_, tslib, quto, value) {
            return `return new Promise(function(resolve){require(['${value}'], function(ret) {resolve(${tslib}.__importStar(ret));})});`;
          }
        );
    }
  ],
  preprocessor: null
});

fis.match('*', {
  deploy: fis.plugin('local-deliver', {
    to: fis.get('options.d') || fis.get('options.desc') || './lib'
  })
});
fis.match('/src/**.{jsx,tsx,js,ts,svg}', {
  isMod: false,
  standard: false
});

fis.match('/src/**.{jsx,tsx,js,ts}', {
  postprocessor: function (content, file) {
    return content
      .replace(/^''/gm, '')
      .replace(/\/\/# sourceMappingURL=\//g, '//# sourceMappingURL=./');
  }
});
fis.match('*.scss', {
  postprocessor: function (content, file) {
    return content.replace(
      /\/\*# sourceMappingURL=\//g,
      '/*# sourceMappingURL=./'
    );
  }
});
fis.match('::package', {
  postpackager: function (ret) {
    Object.keys(ret.src).forEach(function (subpath) {
      var file = ret.src[subpath];
      if (!file.isText()) {
        return;
      }
      var content = file.getContent();
      if (subpath === '/src/components/icons.tsx') {
        content = content.replace(/\.svg/g, '.js');
      } else {
        content = content.replace(
          /@require\s+(?:\.\.\/)?node_modules\//g,
          '@require '
        );
      }
      file.setContent(content);
    });
  }
});
// publishEnv.unhook('node_modules');
fis.hook('relative');

fis.match('_*.scss', {
  release: false
});
