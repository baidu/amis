/**
 * @file fis-conf.js 配置
 */
const path = require('path');
const fs = require('fs');
const package = require('./package.json');
const parserMarkdown = require('./scripts/md-parser');
const convertSCSSIE11 = require('./scripts/scss-ie11');
const parserCodeMarkdown = require('./scripts/code-md-parser');
fis.get('project.ignore').push('public/**', 'npm/**', 'gh-pages/**');
// 配置只编译哪些文件。

const Resource = fis.require('postpackager-loader/lib/resource.js');
const versionHash = fis.util.md5(package.version);

Resource.extend({
  buildResourceMap: function () {
    const resourceMap = this.__super();
    if (resourceMap === '') {
      return '';
    }

    const map = JSON.parse(resourceMap.substring(20, resourceMap.length - 2));

    Object.keys(map.res).forEach(function (key) {
      if (map.res[key].pkg) {
        map.res[key].pkg = `${versionHash}-${map.res[key].pkg}`;
      }
    });
    Object.keys(map.pkg).forEach(function (key) {
      map.pkg[`${versionHash}-${key}`] = map.pkg[key];
      delete map.pkg[key];
    });

    return `amis.require.resourceMap(${JSON.stringify(map)});`;
  },

  calculate: function () {
    this.__super.apply(this);

    // 标记这个文件，肯定是异步资源，即便是同步加载了。
    Object.keys(this.loaded).forEach(id => {
      const file = this.getFileById(id);

      if (file && file.subpath === '/examples/loadMonacoEditor.ts') {
        this.loaded[id] = true;
      }
    });
  }
});

fis.set('project.files', [
  'schema.json',
  '/scss/helper.scss',
  '/scss/themes/*.scss',
  '/examples/*.html',
  '/examples/*.tpl',
  '/examples/static/*.png',
  '/examples/static/*.svg',
  '/examples/static/*.jpg',
  '/examples/static/*.jpeg',
  '/examples/static/photo/*.jpeg',
  '/examples/static/photo/*.png',
  '/examples/static/audio/*.mp3',
  '/examples/static/video/*.mp4',
  '/src/**.html',
  'mock/**'
]);

fis.match('/schema.json', {
  release: '/$0'
});

fis.match('/mock/**', {
  useCompile: false
});

fis.match('mod.js', {
  useCompile: false
});

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

fis.match('/node_modules/**.js', {
  isMod: true
});

fis.match('tinymce/{tinymce.js,plugins/**.js,themes/silver/theme.js}', {
  ignoreDependencies: true
});

fis.match('tinymce/plugins/*/index.js', {
  ignoreDependencies: false
});

fis.match(/(?:mpegts\.js)/, {
  ignoreDependencies: true
});

fis.match('monaco-editor/min/**.js', {
  isMod: false,
  ignoreDependencies: true
});

fis.match('/docs/**.md', {
  rExt: 'js',
  ignoreDependencies: true,
  parser: [
    parserMarkdown,
    function (contents, file) {
      return contents.replace(
        /\bhref=\\('|")(.+?)\\\1/g,
        function (_, quota, link) {
          if (/\.md($|#)/.test(link) && !/^https?\:/.test(link)) {
            let parts = link.split('#');
            parts[0] = parts[0].replace('.md', '');
            return 'href=\\' + quota + parts.join('#') + '\\' + quota;
          }

          return _;
        }
      );
    }
  ],
  isMod: true
});

fis.on('compile:optimizer', function (file) {
  if (file.isJsLike && file.isMod) {
    var contents = file.getContent();

    if (
      typeof contents === 'string' &&
      contents.substring(0, 7) === 'define('
    ) {
      contents = 'amis.' + contents;

      contents = contents.replace(
        'function(require, exports, module)',
        'function(require, exports, module, define)'
      );

      file.setContent(contents);
    }
  }
});

fis.match('{*.ts,*.jsx,*.tsx,/src/**.js,/src/**.ts}', {
  parser: [
    // docsGennerator,
    fis.plugin('typescript', {
      importHelpers: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      inlineSourceMap: true,
      target: 4
    }),

    function (content) {
      return (
        content
          // ts 4.4 生成的代码是 (0, tslib_1.__importStar)，直接改成 tslib_1.__importStar
          .replace(/\(\d+, (tslib_\d+\.__importStar)\)/g, '$1')
          .replace(/\b[a-zA-Z_0-9$]+\.__uri\s*\(/g, '__uri(')
          .replace(
            /(return|=>)\s*(tslib_\d+)\.__importStar\(require\(('|")(.*?)\3\)\)/g,
            function (_, r, tslib, quto, value) {
              return `${r} new Promise(function(resolve){require(['${value}'], function(ret) {resolve(${tslib}.__importStar(ret));})})`;
            }
          )
      );
    }
  ],
  preprocessor: fis.plugin('js-require-css'),
  isMod: true,
  rExt: '.js'
});

fis.match('markdown-it/**', {
  preprocessor: fis.plugin('js-require-file')
});

fis.match('*.html:jsx', {
  parser: fis.plugin('typescript'),
  rExt: '.js',
  isMod: false
});

// 这些用了 esm
fis.match(
  '{echarts/extension/**.js,zrender/**.js,ansi-to-react/lib/index.js}',
  {
    parser: fis.plugin('typescript', {
      sourceMap: false,
      importHelpers: true,
      esModuleInterop: true,
      emitDecoratorMetadata: false,
      experimentalDecorators: false
    })
  }
);

fis.hook('node_modules', {
  shimProcess: false,
  shimGlobal: false,
  shimBuffer: false
  // shutup: true
});
fis.hook('commonjs', {
  sourceMap: false,
  extList: ['.js', '.jsx', '.tsx', '.ts'],
  paths: {
    'monaco-editor': '/examples/loadMonacoEditor'
  }
});

fis.match('_*.scss', {
  release: false
});

fis.media('dev').match('_*.scss', {
  parser: [
    parserCodeMarkdown,
    function (contents, file) {
      return contents.replace(
        /\bhref=\\('|")(.+?)\\\1/g,
        function (_, quota, link) {
          if (/\.md($|#)/.test(link) && !/^https?\:/.test(link)) {
            let parts = link.split('#');
            parts[0] = parts[0].replace('.md', '');

            if (parts[0][0] !== '/') {
              parts[0] = path
                .resolve(path.dirname(file.subpath), parts[0])
                .replace(/^\/docs/, '');
            }

            return 'href=\\' + quota + parts.join('#') + '\\' + quota;
          }

          return _;
        }
      );
    }
  ],
  release: '$0',
  isMod: true,
  rExt: '.js'
});

fis.media('dev').match('::package', {
  postpackager: fis.plugin('loader', {
    useInlineMap: false,
    resourceType: 'mod'
  })
});

fis.media('dev').match('/node_modules/**.js', {
  packTo: '/pkg/npm.js'
});

fis.match('monaco-editor/**', {
  packTo: null
});

if (fis.project.currentMedia() === 'publish') {
  const publishEnv = fis.media('publish');
  publishEnv.get('project.ignore').push('lib/**');
  publishEnv.set('project.files', ['/scss/**', '/src/**']);

  fis.on('compile:end', function (file) {
    if (
      file.subpath === '/src/index.tsx' ||
      file.subpath === '/examples/mod.js'
    ) {
      file.setContent(file.getContent().replace('@version', package.version));
    }
  });

  publishEnv.match('/scss/(**)', {
    release: '/$1',
    relative: true
  });

  publishEnv.match('/src/(**)', {
    release: '/$1',
    relative: true
  });

  publishEnv.match('/src/**.{jsx,tsx,js,ts}', {
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

  publishEnv.match('*', {
    deploy: fis.plugin('local-deliver', {
      to: fis.get('options.d') || fis.get('options.desc') || './lib'
    })
  });
  publishEnv.match('/src/**.{jsx,tsx,js,ts,svg}', {
    isMod: false,
    standard: false
  });

  publishEnv.match('/src/**.{jsx,tsx,js,ts}', {
    postprocessor: function (content, file) {
      return content
        .replace(/^''/gm, '')
        .replace(/\/\/# sourceMappingURL=\//g, '//# sourceMappingURL=./');
    }
  });
  publishEnv.match('*.scss', {
    postprocessor: function (content, file) {
      return content.replace(
        /\/\*# sourceMappingURL=\//g,
        '/*# sourceMappingURL=./'
      );
    }
  });
  publishEnv.match('::package', {
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
  publishEnv.hook('relative');

  publishEnv.match('_*.scss', {
    release: false
  });
} else if (fis.project.currentMedia() === 'publish-sdk') {
  const env = fis.media('publish-sdk');

  fis.on('compile:end', function (file) {
    if (
      file.subpath === '/src/index.tsx' ||
      file.subpath === '/examples/mod.js' ||
      file.subpath === '/examples/loader.ts'
    ) {
      file.setContent(file.getContent().replace(/@version/g, package.version));
    }
  });

  env.get('project.ignore').push('sdk/**');
  env.set('project.files', ['examples/sdk-placeholder.html']);

  env.match('/{examples,scss,src}/(**)', {
    release: '/$1'
  });

  env.match('*.map', {
    release: false
  });

  env.match('/node_modules/(**)', {
    release: '/thirds/$1'
  });

  env.match('/node_modules/(*)/dist/(**)', {
    release: '/thirds/$1/$2'
  });

  env.match('*.scss', {
    parser: fis.plugin('sass', {
      sourceMap: false
    })
  });

  env.match('{*.ts,*.jsx,*.tsx,/src/**.js,/src/**.ts}', {
    parser: [
      // docsGennerator,
      fis.plugin('typescript', {
        importHelpers: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        sourceMap: false
      }),
      function (content) {
        return content
          .replace(/\b[a-zA-Z_0-9$]+\.__uri\s*\(/g, '__uri(')
          .replace(/\(\d+, (tslib_\d+\.__importStar)\)/g, '$1')
          .replace(
            /return\s+(tslib_\d+)\.__importStar\(require\(('|")(.*?)\2\)\);/g,
            function (_, tslib, quto, value) {
              return `return new Promise(function(resolve){require(['${value}'], function(ret) {resolve(${tslib}.__importStar(ret));})});`;
            }
          );
      }
    ],
    preprocessor: fis.plugin('js-require-css'),
    isMod: true,
    rExt: '.js'
  });

  env.match('/examples/mod.js', {
    isMod: false,
    optimizer: fis.plugin('terser')
  });

  env.match('*.{js,jsx,ts,tsx}', {
    optimizer: fis.plugin('terser'),
    moduleId: function (m, path) {
      return fis.util.md5(package.version + 'amis-sdk' + path);
    }
  });

  env.match('/src/icons/**.svg', {
    optimizer: fis.plugin('uglify-js'),
    moduleId: function (m, path) {
      return fis.util.md5(package.version + 'amis-sdk' + path);
    }
  });

  env.match('::package', {
    packager: fis.plugin('deps-pack', {
      'sdk.js': [
        'examples/mod.js',
        'examples/embed.tsx',
        'examples/embed.tsx:deps',
        'examples/loadMonacoEditor.ts',
        '!mpegts.js/**',
        '!hls.js/**',
        '!froala-editor/**',

        '!tinymce/**',
        '!zrender/**',
        '!echarts/**',
        '!echarts-stat/**',
        '!papaparse/**',
        '!exceljs/**',
        '!docsearch.js/**',
        '!monaco-editor/**.css',
        '!src/components/RichText.tsx',
        '!src/components/Tinymce.tsx',
        '!src/components/ColorPicker.tsx',
        '!react-color/**',
        '!material-colors/**',
        '!reactcss/**',
        '!tinycolor2/**',
        '!cropperjs/**',
        '!react-cropper/**',
        '!src/lib/renderers/Form/CityDB.js',
        '!src/components/Markdown.tsx',
        '!src/utils/markdown.ts',
        '!highlight.js/**',
        '!entities/**',
        '!linkify-it/**',
        '!mdurl/**',
        '!uc.micro/**',
        '!markdown-it/**',
        '!markdown-it-html5-media/**',
        '!punycode/**'
      ],

      'rich-text.js': ['src/components/RichText.tsx', 'froala-editor/**'],

      'tinymce.js': ['src/components/Tinymce.tsx', 'tinymce/**'],

      'papaparse.js': ['papaparse/**'],

      'exceljs.js': ['exceljs/**'],

      'markdown.js': [
        'src/components/Markdown.tsx',
        'src/utils/markdown.ts',
        'highlight.js/**',
        'entities/**',
        'linkify-it/**',
        'mdurl/**',
        'uc.micro/**',
        'markdown-it/**',
        'markdown-it-html5-media/**',
        'punycode/**'
      ],

      'color-picker.js': [
        'src/components/ColorPicker.tsx',
        'react-color/**',
        'material-colors/**',
        'reactcss/**',
        'tinycolor2/**'
      ],

      'cropperjs.js': ['cropperjs/**', 'react-cropper/**'],

      'charts.js': ['zrender/**', 'echarts/**', 'echarts-stat/**'],

      'rest.js': [
        '*.js',
        '!monaco-editor/**',
        '!mpegts.js/**',
        '!hls.js/**',
        '!froala-editor/**',

        '!src/components/RichText.tsx',
        '!zrender/**',
        '!echarts/**',
        '!papaparse/**',
        '!exceljs/**',
        '!src/utils/markdown.ts',
        '!highlight.js/**',
        '!argparse/**',
        '!entities/**',
        '!linkify-it/**',
        '!mdurl/**',
        '!uc.micro/**',
        '!markdown-it/**',
        '!markdown-it-html5-media/**'
      ]
    }),
    postpackager: [
      fis.plugin('loader', {
        useInlineMap: false,
        resourceType: 'mod'
      }),

      require('./scripts/embed-packager')
    ]
  });

  env.match('{*.min.js,monaco-editor/min/**.js}', {
    optimizer: null
  });

  env.match('monaco-editor/**.css', {
    standard: false
  });

  fis.on('compile:optimizer', function (file) {
    if (file.isJsLike && file.isMod) {
      var contents = file.getContent();

      // 替换 worker 地址的路径，让 sdk 加载同目录下的文件。
      // 如果 sdk 和 worker 不是部署在一个地方，请通过指定 MonacoEnvironment.getWorkerUrl
      if (
        file.subpath === '/src/components/Editor.tsx' ||
        file.subpath === '/examples/loadMonacoEditor.ts'
      ) {
        contents = contents.replace(
          /function\sfilterUrl\(url\)\s\{\s*return\s*url;/m,
          function () {
            return `var _path = '';
    try {
      throw new Error()
    } catch (e) {
      _path = (/((?:https?|file):.*?)\\n/.test(e.stack) && RegExp.$1).replace(/\\/[^\\/]*$/, '');
    }
    function filterUrl(url) {
      return _path + url.substring(1);`;
          }
        );

        file.setContent(contents);
      }
    }
  });

  env.match('/examples/loader.ts', {
    isMod: false
  });

  env.match('*', {
    domain: '.',
    deploy: [
      fis.plugin('skip-packed'),
      function (_, modified, total, callback) {
        var i = modified.length - 1;
        var file;

        while ((file = modified[i--])) {
          if (file.skiped || /\.map$/.test(file.subpath)) {
            modified.splice(i + 1, 1);
          }
        }

        i = total.length - 1;
        while ((file = total[i--])) {
          if (file.skiped || /\.map$/.test(file.subpath)) {
            total.splice(i + 1, 1);
          }
        }

        callback();
      },
      fis.plugin('local-deliver', {
        to: './sdk'
      })
    ]
  });
} else if (fis.project.currentMedia() === 'gh-pages') {
  fis.match('*-ie11.scss', {
    postprocessor: convertSCSSIE11
  });
  const ghPages = fis.media('gh-pages');

  ghPages.match('*.scss', {
    parser: fis.plugin('sass', {
      sourceMap: false
    }),
    rExt: '.css'
  });

  ghPages.match('/docs/**.md', {
    rExt: 'js',
    isMod: true,
    useHash: true,
    parser: [
      parserMarkdown,
      function (contents, file) {
        return contents.replace(
          /\bhref=\\('|")(.+?)\\\1/g,
          function (_, quota, link) {
            if (/\.md($|#)/.test(link) && !/^https?\:/.test(link)) {
              let parts = link.split('#');
              parts[0] = parts[0].replace('.md', '');

              return (
                'href=\\' + quota + '/amis' + parts.join('#') + '\\' + quota
              );
            }

            return _;
          }
        );
      }
    ]
  });

  ghPages.match(/^(\/.*)(_)(.+\.scss)$/, {
    parser: [
      parserCodeMarkdown,
      function (contents, file) {
        return contents.replace(
          /\bhref=\\('|")(.+?)\\\1/g,
          function (_, quota, link) {
            if (/\.md($|#)/.test(link) && !/^https?\:/.test(link)) {
              let parts = link.split('#');
              parts[0] = parts[0].replace('.md', '');

              if (parts[0][0] !== '/') {
                parts[0] = path
                  .resolve(path.dirname(file.subpath), parts[0])
                  .replace(/^\/docs/, '/amis');
              }

              return 'href=\\' + quota + parts.join('#') + '\\' + quota;
            }

            return _;
          }
        );
      }
    ],
    isMod: true,
    rExt: '.js',
    release: '$1$3'
  });

  ghPages.match('/node_modules/(**)', {
    release: '/n/$1'
  });

  ghPages.match('/examples/(**)', {
    release: '/$1'
  });

  // 在爱速搭中不用 cfc，而是放 amis 目录下的路由接管
  let cfcAddress =
    'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock';
  if (process.env.IS_AISUDA) {
    cfcAddress = '/amis/api';
  }

  ghPages.match('/{examples,docs}/**', {
    preprocessor: function (contents, file) {
      if (!file.isText() || typeof contents !== 'string') {
        return contents;
      }

      return contents.replace(
        /(\\?(?:'|"))((?:get|post|delete|put)\:)?\/api\/(\w+)/gi,
        function (_, qutoa, method, path) {
          return qutoa + (method || '') + `${cfcAddress}/` + path;
        }
      );
    }
  });

  ghPages.match('mock/**.{json,js,conf}', {
    release: false
  });

  ghPages.match('::package', {
    packager: fis.plugin('deps-pack', {
      'pkg/npm.js': [
        '/examples/mod.js',
        'node_modules/**.js',
        '!monaco-editor/**',
        '!mpegts.js/**',
        '!hls.js/**',
        '!froala-editor/**',

        '!tinymce/**',
        '!zrender/**',
        '!echarts/**',
        '!echarts-stat/**',
        '!papaparse/**',
        '!exceljs/**',
        '!docsearch.js/**',
        '!monaco-editor/**.css',
        '!src/components/RichText.tsx',
        '!src/components/Tinymce.tsx',
        '!src/components/ColorPicker.tsx',
        '!react-color/**',
        '!material-colors/**',
        '!reactcss/**',
        '!tinycolor2/**',
        '!cropperjs/**',
        '!react-cropper/**',
        '!src/lib/renderers/Form/CityDB.js',
        '!src/components/Markdown.tsx',
        '!src/utils/markdown.ts',
        '!highlight.js/**',
        '!entities/**',
        '!linkify-it/**',
        '!mdurl/**',
        '!uc.micro/**',
        '!markdown-it/**',
        '!markdown-it-html5-media/**',
        '!punycode/**'
      ],

      'pkg/rich-text.js': ['src/components/RichText.js', 'froala-editor/**'],

      'pkg/tinymce.js': ['src/components/Tinymce.tsx', 'tinymce/**'],

      'pkg/papaparse.js': ['papaparse/**'],

      'pkg/exceljs.js': ['exceljs/**'],

      'pkg/markdown.js': [
        'src/components/Markdown.tsx',
        'src/utils/markdown.ts',
        'highlight.js/**',
        'entities/**',
        'linkify-it/**',
        'mdurl/**',
        'uc.micro/**',
        'markdown-it/**',
        'markdown-it-html5-media/**',
        'punycode/**'
      ],

      'pkg/color-picker.js': [
        'src/components/ColorPicker.tsx',
        'react-color/**',
        'material-colors/**',
        'reactcss/**',
        'tinycolor2/**'
      ],

      'pkg/cropperjs.js': ['cropperjs/**', 'react-cropper/**'],

      'pkg/charts.js': ['zrender/**', 'echarts/**', 'echarts-stat/**'],

      'pkg/api-mock.js': ['mock/*.ts'],

      'pkg/app.js': [
        '/examples/components/App.tsx',
        '/examples/components/App.tsx:deps'
      ],

      'pkg/echarts-editor.js': [
        '/examples/components/EChartsEditor/*.tsx',
        '!/examples/components/EChartsEditor/Example.tsx',
        '!/examples/components/EChartsEditor/Common.tsx'
      ],

      'pkg/rest.js': [
        '**.{js,jsx,ts,tsx}',
        '!monaco-editor/**',
        '!mpegts.js/**',
        '!hls.js/**',
        '!froala-editor/**',

        '!src/components/RichText.tsx',
        '!zrender/**',
        '!echarts/**',
        '!papaparse/**',
        '!exceljs/**',
        '!src/utils/markdown.ts',
        '!highlight.js/**',
        '!argparse/**',
        '!entities/**',
        '!linkify-it/**',
        '!mdurl/**',
        '!uc.micro/**',
        '!markdown-it/**',
        '!markdown-it-html5-media/**'
      ],

      'pkg/npm.css': ['node_modules/*/**.css', '!monaco-editor/**'],

      // css 打包
      'pkg/style.css': [
        '*.scss',
        '*.css',
        '!/scss/themes/*.scss',
        // 要切换主题，不能打在一起。'/scss/*.scss',
        '!/examples/style.scss',
        '!monaco-editor/**',
        '!/scss/helper.scss',
        '/examples/style.scss' // 让它在最下面
      ]
    }),

    postpackager: [
      fis.plugin('loader', {
        useInlineMap: false,
        resourceType: 'mod'
      }),
      function (ret) {
        const indexHtml = ret.src['/examples/index.html'];
        const appJs = ret.src['/examples/components/App.tsx'];
        const DocJs = ret.src['/examples/components/Doc.tsx'];
        const DocNavCN = ret.src['/examples/components/DocNavCN.ts'];
        const Components = ret.src['/examples/components/Components.tsx'];
        const DocCSS = ret.src['/examples/components/CssDocs.tsx'];
        const ExampleJs = ret.src['/examples/components/Example.tsx'];

        const pages = [];
        const source = [
          appJs.getContent(),
          DocJs.getContent(),
          DocNavCN.getContent(),
          Components.getContent(),
          DocCSS.getContent(),
          ExampleJs.getContent()
        ].join('\n');
        source.replace(
          /\bpath\b\s*\:\s*('|")(.*?)\1/g,
          function (_, qutoa, path) {
            if (path === '*') {
              return;
            }

            pages.push(path.replace(/^\//, ''));
            return _;
          }
        );

        const contents = indexHtml.getContent();
        pages.forEach(function (path) {
          const file = fis.file(
            fis.project.getProjectPath(),
            '/examples/' + path + '.html'
          );
          file.setContent(contents);
          ret.pkg[file.getId()] = file;
        });
      }
    ]
  });

  ghPages.match('*.{css,less,scss}', {
    optimizer: [
      function (contents) {
        if (typeof contents === 'string') {
          contents = contents.replace(/\/\*\!markdown[\s\S]*?\*\//g, '');
        }

        return contents;
      },
      fis.plugin('clean-css')
    ],
    useHash: true
  });

  ghPages.match('::image', {
    useHash: true
  });

  ghPages.match('*.{js,ts,tsx,jsx}', {
    optimizer: fis.plugin('terser'),
    useHash: true
  });

  ghPages.match('*.map', {
    release: false,
    url: 'null',
    useHash: false
  });
  ghPages.match('{*.jsx,*.tsx,*.ts}', {
    moduleId: function (m, path) {
      return fis.util.md5('amis' + path);
    },
    parser: [
      // docsGennerator,
      fis.plugin('typescript', {
        sourceMap: false,
        importHelpers: true,
        esModuleInterop: true
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
    ]
  });
  ghPages.match('*', {
    domain: '/amis',
    deploy: [
      fis.plugin('skip-packed'),
      fis.plugin('local-deliver', {
        to: './gh-pages'
      })
    ]
  });
  ghPages.match('{*.min.js,monaco-editor/min/**.js}', {
    optimizer: null
  });
  ghPages.match('docs.json', {
    domain: null
  });
}

// function docsGennerator(contents, file) {
//   if (file.subpath !== '/examples/components/Doc.tsx') {
//     return contents;
//   }

//   return contents.replace('// {{renderer-docs}}', function () {
//     const dir = path.join(__dirname, 'docs/renderers');
//     const files = [];

//     let fn = (dir, colleciton, prefix = '') => {
//       const entries = fs.readdirSync(dir);

//       entries.forEach(entry => {
//         const subdir = path.join(dir, entry);

//         if (fs.lstatSync(subdir).isDirectory()) {
//           let files = [];
//           fn(subdir, files, path.join(prefix, entry));
//           colleciton.push({
//             name: entry,
//             children: files,
//             path: path.join(prefix, entry)
//           });
//         } else if (/\.md$/.test(entry)) {
//           colleciton.push({
//             name: path.basename(entry, '.md'),
//             path: path.join(prefix, entry)
//           });
//         }
//       });
//     };

//     let fn2 = item => {
//       if (item.children) {
//         const child = item.children.find(
//           child => child.name === `${item.name}.md`
//         );
//         return `{
//                   label: '${item.name}',
//                   ${
//                     child
//                       ? `path: '/docs/renderers/${child.path.replace(
//                           /\.md$/,
//                           ''
//                         )}',`
//                       : ''
//                   }
//                   children: [
//                       ${item.children.map(fn2).join(',\n')}
//                   ]
//               }`;
//       }

//       return `{
//               label: '${item.name}',
//               path: '/docs/renderers/${item.path.replace(/\.md$/, '')}',
//                 getComponent: (location, cb) =>
//                 require(['../../docs/renderers/${item.path}'], doc => {
//                   cb(null, makeMarkdownRenderer(doc));
//                 })
//           }`;
//     };

//     fn(dir, files);

//     return `{
//           label: '渲染器手册',
//           icon: 'fa fa-diamond',
//           path: '/docs/renderers',
//           getComponent: (location, cb) =>
//           require(['../../docs/renderers.md'], doc => {
//             cb(null, makeMarkdownRenderer(doc));
//           }),
//           children: [
//               ${files.map(fn2).join(',\n')}
//           ]
//       },`;
//   });
// }
