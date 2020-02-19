/**
 * @file fis-conf.js 配置
 */
const path = require('path');
const package = require('./package.json');
const parserMarkdown = require('./build/md-parser');
fis.get('project.ignore').push('public/**', 'gh-pages/**', '.*/**');
// 配置只编译哪些文件。

fis.set('project.files', [
  'scss/**.scss',
  '/examples/*.html',
  '/examples/*.tpl',
  '/src/**.html',
  'mock/**'
]);

fis.match('/mock/**', {
  useCompile: false
});

fis.match('mod.js', {
  useCompile: false
});

fis.match('*.scss', {
  parser: fis.plugin('node-sass', {
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

fis.match('/node_modules/**.js', {
  isMod: true
});

fis.match('/docs/**.md', {
  rExt: 'js',
  parser: [
    parserMarkdown,
    function(contents, file) {
      return contents.replace(/\bhref=\\('|")(.+?)\\\1/g, function(
        _,
        quota,
        link
      ) {
        if (/\.md($|#)/.test(link) && !/^https?\:/.test(link)) {
          let parts = link.split('#');
          parts[0] = parts[0].replace('.md', '');

          if (parts[0][0] !== '/') {
            parts[0] = path.resolve(path.dirname(file.subpath), parts[0]);
          }

          return 'href=\\' + quota + parts.join('#') + '\\' + quota;
        }

        return _;
      });
    }
  ],
  isMod: true
});

fis.on('compile:parser', function(file) {
  if (file.subpath === '/src/index.tsx') {
    file.setContent(file.getContent().replace('@version', package.version));
  }
});

fis.match('monaco-editor/esm/**.js', {
  parser: fis.plugin('typescript', {
    importHelpers: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    sourceMap: false
  }),
  preprocessor: fis.plugin('js-require-css')
});

fis.match('{*.ts,*.jsx,*.tsx,/src/**.js,/src/**.ts}', {
  parser: [
    fis.plugin('typescript', {
      importHelpers: true,
      esModuleInterop: true,
      experimentalDecorators: true,
      sourceMap: true
    }),

    function(content) {
      return content.replace(/\b[a-zA-Z_0-9$]+\.__uri\s*\(/g, '__uri(');
    }
  ],
  preprocessor: fis.plugin('js-require-css'),
  isMod: true,
  rExt: '.js'
});

fis.match('*.html:jsx', {
  parser: fis.plugin('typescript'),
  rExt: '.js',
  isMod: false
});

fis.hook('node_modules', {
  shimProcess: false,
  shimGlobal: false,
  shimBuffer: false
});
fis.hook('commonjs', {
  extList: ['.js', '.jsx', '.tsx', '.ts']
});

fis.media('dev').match('::package', {
  prepackager: fis.plugin('stand-alone-pack', {
    '/pkg/editor.worker.js': 'monaco-editor/esm/vs/editor/editor.worker.js',
    '/pkg/json.worker.js': 'monaco-editor/esm/vs/language/json/json.worker',
    '/pkg/css.worker.js': 'monaco-editor/esm/vs/language/css/css.worker',
    '/pkg/html.worker.js': 'monaco-editor/esm/vs/language/html/html.worker',
    '/pkg/ts.worker.js': 'monaco-editor/esm/vs/language/typescript/ts.worker',

    // 替换这些文件里面的路径引用。
    // 如果不配置，源码中对于打包文件的引用是不正确的。
    'replaceFiles': ['src/components/Editor.tsx']
  }),

  postpackager: fis.plugin('loader', {
    useInlineMap: false,
    resourceType: 'mod'
  })
});

fis.media('dev').match('/node_modules/**.js', {
  packTo: '/pkg/npm.js'
});

if (fis.project.currentMedia() === 'publish') {
  const publishEnv = fis.media('publish');
  publishEnv.get('project.ignore').push('lib/**');
  publishEnv.set('project.files', ['/scss/**', '/src/**']);

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
      fis.plugin('typescript', {
        importHelpers: true,
        sourceMap: true,
        experimentalDecorators: true,
        esModuleInterop: true
      }),
      function(contents) {
        return contents.replace(
          /(?:\w+\.)?\b__uri\s*\(\s*('|")(.*?)\1\s*\)/g,
          function(_, quote, value) {
            let str = quote + value + quote;
            return (
              '(function(){try {return __uri(' +
              str +
              ')} catch(e) {return ' +
              str +
              '}})()'
            );
          }
        );
      }
    ]
  });

  publishEnv.match('_*.scss', {
    release: false
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
    postprocessor: function(content, file) {
      return content
        .replace(/^''/gm, '')
        .replace(/\/\/# sourceMappingURL=\//g, '//# sourceMappingURL=./');
    }
  });
  publishEnv.match('*.scss', {
    postprocessor: function(content, file) {
      return content.replace(
        /\/\*# sourceMappingURL=\//g,
        '/*# sourceMappingURL=./'
      );
    }
  });
  publishEnv.match('::package', {
    postpackager: function(ret) {
      Object.keys(ret.src).forEach(function(subpath) {
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
} else if (fis.project.currentMedia() === 'publish-sdk') {
  const env = fis.media('publish-sdk');

  env.get('project.ignore').push('sdk/**');
  env.set('project.files', ['examples/sdk-placeholder.html']);

  env.match('/{examples,scss}/(**)', {
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
    parser: fis.plugin('node-sass', {
      sourceMap: false
    })
  });

  env.match('{*.ts,*.jsx,*.tsx,/src/**.js,/src/**.ts}', {
    parser: [
      fis.plugin('typescript', {
        importHelpers: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        sourceMap: false
      }),

      function(content) {
        return content.replace(/\b[a-zA-Z_0-9$]+\.__uri\s*\(/g, '__uri(');
      }
    ],
    preprocessor: fis.plugin('js-require-css'),
    isMod: true,
    rExt: '.js'
  });

  env.match('/examples/sdk-mod.js', {
    isMod: false
  });

  env.match('*.{js,jsx,ts,tsx}', {
    optimizer: fis.plugin('uglify-js'),
    moduleId: function(m, path) {
      return fis.util.md5('amis-sdk' + path);
    }
  });

  env.match('/src/icons/**.svg', {
    optimizer: fis.plugin('uglify-js'),
    moduleId: function(m, path) {
      return fis.util.md5('amis-sdk' + path);
    }
  });

  env.match('::package', {
    packager: fis.plugin('deps-pack', {
      'sdk.js': [
        'examples/sdk-mod.js',
        'examples/embed.tsx',
        'examples/embed.tsx:deps',
        '!monaco-editor/**',
        '!flv.js/**',
        '!hls.js/**',
        '!froala-editor/**',
        '!src/components/RichText.tsx',
        '!jquery/**',
        '!zrender/**',
        '!echarts/**',
        '!docsearch.js/**'
      ],

      'rich-text.js': [
        'src/components/RichText.tsx',
        'froala-editor/**',
        'jquery/**'
      ],

      'charts.js': ['zrender/**', 'echarts/**'],

      'editor.js': [
        'monaco-editor/esm/vs/editor/editor.main.js',
        'monaco-editor/esm/vs/editor/editor.main.js:deps'
      ],

      'rest.js': [
        '*.js',
        '!monaco-editor/**',
        '!flv.js/**',
        '!hls.js/**',
        '!froala-editor/**',
        '!src/components/RichText.tsx',
        '!jquery/**',
        '!zrender/**',
        '!echarts/**'
      ]
    }),
    postpackager: [
      fis.plugin('loader', {
        useInlineMap: false,
        resourceType: 'mod'
      }),

      require('./build/embed-packager')
    ]
  });

  fis.on('compile:optimizer', function(file) {
    if (file.isJsLike && file.isMod) {
      var contents = file.getContent();

      // 替换 worker 地址的路径，让 sdk 加载同目录下的文件。
      // 如果 sdk 和 worker 不是部署在一个地方，请通过指定 MonacoEnvironment.getWorkerUrl
      if (file.subpath === '/src/components/Editor.tsx') {
        contents = contents.replace(
          /function\sfilterUrl\(url\)\s\{\s*return\s*url;/m,
          function() {
            return `var _path = '';
    try {
      throw new Error()
    } catch (e) {
      _path = (/((?:https?|file)\:.*)$/.test(e.stack) && RegExp.$1).replace(/\\/[^\\/]*$/, '');
    }
    function filterUrl(url) {
      return _path + url.substring(1);`;
          }
        );
      }

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

  env.match('/examples/loader.ts', {
    isMod: false
  });

  env.match('::packager', {
    prepackager: [
      fis.plugin('stand-alone-pack', {
        '/pkg/editor.worker.js': 'monaco-editor/esm/vs/editor/editor.worker.js',
        '/pkg/json.worker.js': 'monaco-editor/esm/vs/language/json/json.worker',
        '/pkg/css.worker.js': 'monaco-editor/esm/vs/language/css/css.worker',
        '/pkg/html.worker.js': 'monaco-editor/esm/vs/language/html/html.worker',
        '/pkg/ts.worker.js':
          'monaco-editor/esm/vs/language/typescript/ts.worker',

        // 替换这些文件里面的路径引用。
        // 如果不配置，源码中对于打包文件的引用是不正确的。
        'replaceFiles': ['src/components/Editor.tsx']
      }),
      function(ret) {
        const root = fis.project.getProjectPath();
        [
          '/pkg/editor.worker.js',
          '/pkg/json.worker.js',
          '/pkg/css.worker.js',
          '/pkg/html.worker.js',
          '/pkg/ts.worker.js'
        ].forEach(function(pkgFile) {
          const packedFile = fis.file.wrap(path.join(root, pkgFile));
          const file = ret.pkg[packedFile.subpath];
          let contents = file.getContent();

          contents = contents.replace(/amis\.define/g, 'define');
          file.setContent(contents);
        });
      }
    ]
  });

  env.match('*', {
    domain: '.',
    deploy: [
      fis.plugin('skip-packed'),
      function(_, modified, total, callback) {
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
  const ghPages = fis.media('gh-pages');

  ghPages.match('/docs/**.md', {
    rExt: 'js',
    isMod: true,
    useHash: true,
    parser: [
      parserMarkdown,
      function(contents, file) {
        return contents.replace(/\bhref=\\('|")(.+?)\\\1/g, function(
          _,
          quota,
          link
        ) {
          if (/\.md($|#)/.test(link) && !/^https?\:/.test(link)) {
            let parts = link.split('#');
            parts[0] = parts[0].replace('.md', '');

            if (parts[0][0] !== '/') {
              parts[0] = path.resolve(path.dirname(file.subpath), parts[0]);
            }

            return 'href=\\' + quota + '/amis' + parts.join('#') + '\\' + quota;
          }

          return _;
        });
      }
    ]
  });

  ghPages.match('/node_modules/(**)', {
    release: '/n/$1'
  });

  ghPages.match('/examples/(**)', {
    release: '/$1'
  });

  ghPages.match('/{examples,docs}/**', {
    preprocessor: function(contents, file) {
      if (!file.isText() || typeof contents !== 'string') {
        return contents;
      }

      return contents
        .replace(
          /(\\?(?:'|"))((?:get|post|delete|put)\:)?\/api\/mock2?/gi,
          function(_, qutoa, method) {
            return (
              qutoa + (method || '') + 'https://houtai.baidu.com/api/mock2'
            );
          }
        )
        .replace(
          /(\\?(?:'|"))((?:get|post|delete|put)\:)?\/api\/sample/gi,
          function(_, qutoa, method) {
            return (
              qutoa + (method || '') + 'https://houtai.baidu.com/api/sample'
            );
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
        '!flv.js/**',
        '!hls.js/**',
        '!froala-editor/**',
        '!amis/lib/components/RichText.js',
        '!jquery/**',
        '!zrender/**',
        '!echarts/**'
      ],
      'pkg/rich-text.js': [
        'amis/lib/components/RichText.js',
        'froala-editor/**',
        'jquery/**'
      ],
      'pkg/charts.js': ['zrender/**', 'echarts/**'],
      'pkg/api-mock.js': ['mock/*.ts'],
      'pkg/app.js': [
        '/examples/components/App.jsx',
        '/examples/components/App.jsx:deps'
      ],

      'pkg/editor.js': [
        'monaco-editor/esm/vs/editor/editor.main.js',
        'monaco-editor/esm/vs/editor/editor.main.js:deps'
      ],

      'pkg/rest.js': [
        '**.{js,jsx,ts,tsx}',
        '!static/mod.js',
        '!monaco-editor/**',
        '!echarts/**',
        '!flv.js/**',
        '!hls.js/**',
        '!froala-editor/**',
        '!jquery/**',
        '!amis/lib/components/RichText.js',
        '!zrender/**',
        '!echarts/**'
      ],

      'pkg/npm.css': ['node_modules/*/**.css', '!monaco-editor/**'],

      // css 打包
      'pkg/style.css': [
        '*.scss',
        '*.css',
        '!/scss/themes/*.scss',
        // 要切换主题，不能打在一起。'/scss/*.scss',
        '!/examples/style.scss',
        '/examples/style.scss' // 让它在最下面
      ]
    }),

    postpackager: [
      fis.plugin('loader', {
        useInlineMap: false,
        resourceType: 'mod'
      }),
      function(ret) {
        const indexHtml = ret.src['/examples/index.html'];
        const appJs = ret.src['/examples/components/App.jsx'];
        const DocJs = ret.src['/examples/components/Doc.jsx'];

        const pages = [];
        const source = [appJs.getContent(), DocJs.getContent()].join('\n');
        source.replace(/\bpath\b\s*\:\s*('|")(.*?)\1/g, function(
          _,
          qutoa,
          path
        ) {
          if (path === '*') {
            return;
          }

          pages.push(path.replace(/^\//, ''));
          return _;
        });

        const contents = indexHtml.getContent();
        pages.forEach(function(path) {
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
    optimizer: fis.plugin('clean-css'),
    useHash: true
  });

  ghPages.match('::image', {
    useHash: true
  });

  ghPages.match('*.{js,ts,tsx,jsx}', {
    optimizer: fis.plugin('uglify-js'),
    useHash: true
  });

  ghPages.match('*.map', {
    release: false,
    url: 'null',
    useHash: false
  });
  ghPages.match('{*.jsx,*.tsx,*.ts}', {
    moduleId: function(m, path) {
      return fis.util.md5('amis' + path);
    },
    parser: fis.plugin('typescript', {
      sourceMap: false,
      importHelpers: true,
      esModuleInterop: true
    })
  });
  ghPages.match('*', {
    domain: 'https://bce.bdstatic.com/fex/amis-gh-pages',
    deploy: [
      fis.plugin('skip-packed'),
      fis.plugin('local-deliver', {
        to: './gh-pages'
      })
    ]
  });
  ghPages.match('{*.min.js}', {
    optimizer: null
  });
}
