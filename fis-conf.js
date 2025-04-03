/**
 * @file fis-conf.js 配置
 */
const path = require('path');
const fs = require('fs');
const package = require('./packages/amis/package.json');
const parserMarkdown = require('./scripts/md-parser');
const convertSCSSIE11 = require('./scripts/scss-ie11');
const parserCodeMarkdown = require('./scripts/code-md-parser');
const transformNodeEnvInline = require('./scripts/transform-node-env-inline');
fis.set('project.ignore', [
  'public/**',
  'scripts/**',
  'npm/**',
  'gh-pages/**',
  '.*/**',
  'node_modules/**'
]);
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
    const self = this;

    Object.keys(map.res).forEach(function (key) {
      const item = map.res[key];
      if (item.pkg) {
        const pkgNode = self.getNode(item.pkg, 'pkg');
        item.pkg = `${versionHash}-${item.pkg}`;

        // if (Array.isArray(item.deps) && pkgNode) {
        //   item.deps = item.deps.filter(
        //     dep =>
        //       !pkgNode.has.find(id => {
        //         const node = self.getNode(id);
        //         const file = self.getFileById(id);
        //         const moduleId =
        //           (node.extras && node.extras.moduleId) ||
        //           (file && file.moduleId) ||
        //           id.replace(/\.js$/i, '');

        //         return moduleId === dep;
        //       })
        //   );
        //   if (!item.deps.length) {
        //     delete item.deps;
        //   }
        // }
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
  '/examples/map.json',
  '/scss/helper.scss',
  '/scss/themes/*.scss',
  '/examples/*.html',
  '/examples/app/*.html',
  '/examples/*.tpl',
  '/examples/static/*.png',
  '/examples/static/*.svg',
  '/examples/static/*.jpg',
  '/examples/static/*.jpeg',
  '/examples/static/*.docx',
  '/examples/static/*.xlsx',
  '/examples/static/photo/*.jpeg',
  '/examples/static/photo/*.png',
  '/examples/static/audio/*.mp3',
  '/examples/static/video/*.mp4',
  '/examples/static/font/*.ttf',
  'mock/**'
]);

fis.match('/schema.json', {
  release: '/$0'
});

fis.match('/mock/**', {
  useCompile: false
});

// fis.match('mod.js', {
//   useCompile: false
// });

fis.match('*.scss', {
  parser: fis.plugin('sass', {
    sourceMap: true
  }),
  rExt: '.css'
});

fis.match('icons/**.svg', {
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

fis.match('/node_modules/**.{js,cjs}', {
  isMod: true,
  rExt: 'js'
});

fis.match('pdfjs-dist/**/pdf.mjs', {
  isMod: true,
  rExt: 'js',
  parser: fis.plugin('typescript', {
    sourceMap: false,
    importHelpers: true,
    esModuleInterop: true,
    emitDecoratorMetadata: false,
    experimentalDecorators: false
  })
});

fis.set('project.fileType.text', 'cjs,mjs');

fis.match('tinymce/{tinymce.js,plugins/**.js,themes/silver/theme.js}', {
  ignoreDependencies: true
});

fis.match('tinymce/plugins/*/index.js', {
  ignoreDependencies: false
});

fis.match(/(?:mpegts\.js|object\-inspect\/util\.inspect\.js)/, {
  ignoreDependencies: true
});

fis.match('monaco-editor/min/**.js', {
  isMod: false,
  ignoreDependencies: true
});

fis.match('{/docs,/packages/amis-ui/scss/helper}/**.md', {
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

fis.match('{*.ts,*.jsx,*.tsx,/examples/**.js,/src/**.js,/src/**.ts}', {
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
fis.match('/examples/mod.js', {
  isMod: false
});

fis.match('{markdown-it,moment-timezone,pdfjs-dist}/**', {
  preprocessor: fis.plugin('js-require-file')
});

fis.match('*.html:jsx', {
  parser: fis.plugin('typescript'),
  rExt: '.js',
  isMod: false
});

// 这些用了 esm
fis.match(
  '{echarts/**.js,zrender/**.js,echarts-wordcloud/**.js,markdown-it-html5-media/**.js,react-hook-form/**.js,qrcode.react/**.js,axios/**.js,downshift/**.js,react-intersection-observer/**.js,react-pdf/**.js}',
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

// 过滤掉 process.env.NODE_ENV 分支中无关代码
// 避免被分析成依赖，因为 fis 中是通过正则分析 require 语句的
fis.on('process:start', transformNodeEnvInline);

if (fis.project.currentMedia() === 'dev') {
  fis.match('/packages/**/*.{ts,tsx,js}', {
    isMod: true
  });

  // 将子工程的查找，跳转到 src 目录去
  // 可能 windows 下跑不了
  const projects = [];
  fs.readdirSync(path.join(__dirname, 'packages')).forEach(file => {
    if (fs.lstatSync(path.join(__dirname, 'packages', file)).isDirectory()) {
      projects.push(file);
    }
  });
  projects.sort(function (a, b) {
    return a.length < b.length ? 1 : a.length === b.length ? 0 : -1;
  });
  projects.length &&
    fis.on('lookup:file', function (info, file) {
      const uri = info.rest;
      let newName = '';
      let pkg = '';

      if (/^amis\/lib\/themes\/(.*)\.css$/.test(uri)) {
        newName = `/packages/amis-ui/scss/themes/${RegExp.$1}.scss`;
      } else if (/^amis\/lib\/(.*)\.css$/.test(uri)) {
        newName = `/packages/amis-ui/scss/${RegExp.$1}.scss`;
      } else if (
        uri === 'amis-formula/lib/doc' ||
        uri === 'amis-formula/lib/doc.md'
      ) {
        // 啥也不干
      } else if ((pkg = projects.find(pkg => uri.indexOf(pkg) === 0))) {
        const parts = uri.split('/');
        if (parts[1] === 'lib') {
          parts.splice(1, 1, 'src');
        } else if (parts.length === 1) {
          parts.push('src', 'index');
        }

        newName = `/packages/${parts.join('/')}`;
      }

      if (newName) {
        delete info.file;
        var result = fis.project.lookup(newName, file);
        if (result.file) {
          info.file = result.file;
          info.id = result.file.getId();
        } else {
          console.log(`\`${newName}\` 找不到`);
        }
      }
    });
  fis.on('compile:end', function (file) {
    if (file.subpath === '/packages/amis-core/src/index.tsx') {
      file.setContent(
        file
          .getContent()
          .replace(/__buildVersion/g, JSON.stringify(package.version))
      );
    }
  });
}

fis.unhook('components');
fis.hook('node_modules', {
  shimProcess: false,
  shimGlobal: false,
  shimBuffer: false
  // shutup: true
});
fis.hook('commonjs', {
  sourceMap: false,
  extList: ['.js', '.jsx', '.tsx', '.ts', '.cjs', '.mjs'],
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

fis.match('{monaco-editor,amis,amis-core}/**', {
  packTo: null
});

if (fis.project.currentMedia() === 'publish-sdk') {
  const sdkEnv = fis.media('publish-sdk');

  fis.on('compile:end', function (file) {
    if (
      file.subpath === '/packages/amis/src/index.tsx' ||
      file.subpath === '/examples/mod.js' ||
      file.subpath === '/examples/loader.ts'
    ) {
      file.setContent(file.getContent().replace(/@version/g, package.version));
    } else if (file.subpath === '/packages/amis-core/src/index.tsx') {
      file.setContent(
        file
          .getContent()
          .replace(/__buildVersion/g, JSON.stringify(package.version))
      );
    }
  });

  sdkEnv.get('project.ignore').push('sdk/**');
  sdkEnv.set('project.files', ['examples/sdk-placeholder.html']);

  sdkEnv.match('/{examples,scss,src}/(**)', {
    release: '/$1'
  });

  sdkEnv.match('*.map', {
    release: false
  });

  sdkEnv.match('/node_modules/(**)', {
    release: '/thirds/$1'
  });

  sdkEnv.match('/node_modules/(*)/dist/(**)', {
    release: '/thirds/$1/$2'
  });

  sdkEnv.match('*.scss', {
    parser: fis.plugin('sass', {
      sourceMap: false
    })
  });

  sdkEnv.match('{*.ts,*.jsx,*.tsx,/examples/**.js,/src/**.js,/src/**.ts}', {
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

  sdkEnv.match('/examples/mod.js', {
    isMod: false,
    optimizer: fis.plugin('terser')
  });

  sdkEnv.match('*.{js,jsx,ts,tsx}', {
    optimizer: fis.plugin('terser'),
    moduleId: function (m, path) {
      return fis.util.md5(package.version + 'amis-sdk' + path);
    }
  });

  sdkEnv.match('::package', {
    packager: fis.plugin('deps-pack', {
      'sdk.js': [
        'examples/mod.js',
        'examples/embed.tsx',
        'examples/embed.tsx:deps',
        'examples/loadMonacoEditor.ts',
        '!mpegts.js/**',
        '!hls.js/**',
        '!froala-editor/**',
        '!codemirror/**',
        '!tinymce/**',
        '!zrender/**',
        '!echarts/**',
        '!echarts-stat/**',
        '!echarts-wordcloud/**',
        '!papaparse/**',
        '!exceljs/**',
        '!xlsx/**',
        '!docsearch.js/**',
        '!monaco-editor/**.css',
        '!amis-ui/lib/components/RichText.js',
        '!amis-ui/lib/components/Tinymce.js',
        '!amis-ui/lib/components/ColorPicker.js',
        '!amis-ui/lib/components/PdfViewer.js',
        '!react-pdf/**',
        '!pdfjs-dist/**',
        '!react-color/**',
        '!material-colors/**',
        '!reactcss/**',
        '!tinycolor2/**',
        '!cropperjs/**',
        '!react-json-view/**',
        '!react-cropper/**',
        '!jsbarcode/**',
        '!amis-ui/lib/components/BarCode.js',
        '!amis-ui/lib/renderers/Form/CityDB.js',
        '!amis-ui/lib/components/Markdown.js',
        '!amis-core/lib/utils/markdown.js',
        '!highlight.js/**',
        '!entities/**',
        '!linkify-it/**',
        '!mdurl/**',
        '!uc.micro/**',
        '!markdown-it/**',
        '!markdown-it-html5-media/**',
        '!punycode/**',
        '!office-viewer/**',
        '!numfmt/**',
        '!amis-formula/lib/doc.js'
      ],

      'rich-text.js': [
        'amis-ui/lib/components/RichText.js',
        'froala-editor/**'
      ],

      'tinymce.js': ['amis-ui/lib/components/Tinymce.js', 'tinymce/**'],

      'codemirror.js': ['codemirror/**'],
      'papaparse.js': ['papaparse/**'],

      'exceljs.js': ['exceljs/**'],

      'xlsx.js': ['xlsx/**'],

      'markdown.js': [
        'amis-ui/lib/components/Markdown.js',
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
        'amis-ui/lib/components/ColorPicker.js',
        'react-color/**',
        'material-colors/**',
        'reactcss/**',
        'tinycolor2/**'
      ],

      'pdf-viewer.js': ['amis-ui/lib/components/PdfViewer.js', 'react-pdf/**'],

      'cropperjs.js': ['cropperjs/**', 'react-cropper/**'],

      'barcode.js': ['src/components/BarCode.tsx', 'jsbarcode/**'],

      'charts.js': [
        'zrender/**',
        'echarts/**',
        'echarts-stat/**',
        'echarts-wordcloud/**'
      ],

      'office-viewer.js': ['office-viewer/**', 'numfmt/**'],
      'json-view.js': 'react-json-view/**',
      'fomula-doc.js': 'amis-formula/lib/doc.js',

      'rest.js': [
        '*.js',
        '!monaco-editor/**',
        '!codemirror/**',
        '!mpegts.js/**',
        '!hls.js/**',
        '!froala-editor/**',
        '!react-pdf/**',
        '!pdfjs-dist/**',
        '!amis-ui/lib/components/RichText.js',
        '!zrender/**',
        '!echarts/**',
        '!echarts-wordcloud/**',
        '!papaparse/**',
        '!exceljs/**',
        '!xlsx/**',
        '!highlight.js/**',
        '!argparse/**',
        '!entities/**',
        '!linkify-it/**',
        '!mdurl/**',
        '!uc.micro/**',
        '!markdown-it/**',
        '!markdown-it-html5-media/**',
        '!office-viewer/**',
        '!numfmt/**'
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

  sdkEnv.match('{*.min.js,monaco-editor/min/**.js}', {
    optimizer: null
  });

  sdkEnv.match('monaco-editor/**.css', {
    standard: false
  });

  fis.on('compile:optimizer', function (file) {
    if (file.isJsLike && file.isMod) {
      var contents = file.getContent();

      // 替换 worker 地址的路径，让 sdk 加载同目录下的文件。
      // 如果 sdk 和 worker 不是部署在一个地方，请通过指定 MonacoEnvironment.getWorkerUrl
      if (
        file.subpath === '/node_modules/amis-ui/lib/components/Editor.js' ||
        file.subpath === '/examples/loadMonacoEditor.ts' ||
        file.subpath === '/examples/loadPdfjsWorker.ts'
      ) {
        contents = contents.replace(
          /function\sfilterUrl\(url\)\s\{\s*return\s*url;/m,
          function () {
            return `function filterUrl(url) {
      return amis['sdk@${package.version}BasePath'] + url.substring(1);`;
          }
        );

        file.setContent(contents);
      }
    }
  });

  sdkEnv.match('/examples/loader.ts', {
    isMod: false
  });

  sdkEnv.match('*', {
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
  ghPages.set('project.files', [
    'examples/index.html',
    'examples/app/index.html',
    '/examples/static/*.docx',
    '/examples/static/*.xlsx'
    // '/examples/map.json'
  ]);

  ghPages.match('*.scss', {
    parser: fis.plugin('sass', {
      sourceMap: false
    }),
    rExt: '.css'
  });

  ghPages.match('{/docs,/packages/amis-ui/scss/helper}/**.md', {
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
        '!codemirror/**',
        '!mpegts.js/**',
        '!hls.js/**',
        '!froala-editor/**',

        '!tinymce/**',
        '!zrender/**',
        '!echarts/**',
        '!echarts-stat/**',
        '!echarts-wordcloud/**',
        '!papaparse/**',
        '!exceljs/**',
        '!xlsx/**',
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
        '!jsbarcode/**',
        '!src/components/BarCode.tsx',
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
        '!punycode/**',
        '!amis-formula/**',
        '!numfmt/**',
        '!office-viewer/**',
        '!amis-core/**',
        '!amis-ui/**',
        '!amis/**',
        '!react-pdf/**',
        '!pdfjs-dist/**'
      ],

      'pkg/rich-text.js': [
        'amis-ui/lib/components/RichText.js',
        'froala-editor/**'
      ],

      'pkg/tinymce.js': ['amis-ui/lib/components/Tinymce.tsx', 'tinymce/**'],

      'pkg/codemirror.js': ['codemirror/**'],

      'pkg/papaparse.js': ['papaparse/**'],

      'pkg/exceljs.js': ['exceljs/**'],

      'pkg/xlsx.js': ['xlsx/**'],

      'pkg/barcode.js': ['amis-ui/lib/components/BarCode.tsx', 'jsbarcode/**'],

      'pkg/markdown.js': [
        'amis-ui/lib/components/Markdown.tsx',
        'amis-core/lib/utils/markdown.ts',
        'highlight.js/**',
        'entities/**',
        'linkify-it/**',
        'mdurl/**',
        'uc.micro/**',
        'markdown-it/**',
        'markdown-it-html5-media/**',
        'punycode/**'
      ],

      'pkg/pdf-viewer.js': [
        'amis-ui/lib/components/PdfViewer.js',
        'react-pdf/**'
      ],

      'pkg/color-picker.js': [
        'amis-ui/lib/components/ColorPicker.tsx',
        'react-color/**',
        'material-colors/**',
        'reactcss/**',
        'tinycolor2/**'
      ],

      'pkg/cropperjs.js': ['cropperjs/**', 'react-cropper/**'],

      'pkg/charts.js': [
        'zrender/**',
        'echarts/**',
        'echarts-stat/**',
        'echarts-wordcloud/**'
      ],

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

      'pkg/office-viewer.js': ['office-viewer/**', 'numfmt/**'],

      'pkg/rest.js': [
        '**.{js,jsx,ts,tsx}',
        '!monaco-editor/**',
        '!mpegts.js/**',
        '!hls.js/**',
        '!froala-editor/**',

        '!amis-ui/lib/components/RichText.tsx',
        '!zrender/**',
        '!echarts/**',
        '!echarts-wordcloud/**',
        '!papaparse/**',
        '!exceljs/**',
        '!xlsx/**',
        '!amis-core/lib/utils/markdown.ts',
        '!highlight.js/**',
        '!argparse/**',
        '!entities/**',
        '!linkify-it/**',
        '!mdurl/**',
        '!uc.micro/**',
        '!markdown-it/**',
        '!markdown-it-html5-media/**',
        '!numfmt/**'
      ],

      'pkg/npm.css': ['node_modules/*/**.css', '!monaco-editor/**', '!amis/**'],

      // css 打包
      'pkg/style.css': [
        '*.scss',
        '*.css',
        '!scss/themes/*.scss',
        // 要切换主题，不能打在一起。'/scss/*.scss',
        '!/examples/style.scss',
        '!monaco-editor/**',
        '!scss/helper.scss',
        '!amis/**',
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
        const ExampleJs = ret.src['/examples/components/Example.jsx'];

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

  ghPages.match('*.{docx,xlsx}', {
    useHash: false
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
  ghPages.match('{*.jsx,*.tsx,*.ts,/examples/**.js,}', {
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
