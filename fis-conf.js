/**
 * @file fis-conf.js 配置
 */
const path = require('path');
const parserMarkdown = require('./build/md-parser');
fis.get('project.ignore').push(
    'public/**',
    'gh-pages/**',
    '.*/**'
);

// 配置只编译哪些文件。

fis.set('project.files', [
    '/examples/*.html',
    '/src/**.html',
    'mock/**'
]);

fis.match('/mock/**', {
    useCompile: false
});

fis.match('*.scss', {
    parser: fis.plugin('node-sass', {
        sourceMap: true
    }),
    rExt: '.css'
});

fis.match('_*.scss', {
    release: false
});

fis.match('/node_modules/**.js', {
    isMod: true
});

fis.match('/docs/**.md', {
    rExt: 'js',
    parser: [parserMarkdown, function(contents, file) {
        return contents.replace(/\bhref=\\('|")(.+?)\\\1/g, function(_, quota, link) {
            if (/\.md($|#)/.test(link)) {
                let parts = link.split('#');
                parts[0] = parts[0].replace('.md', '');

                if (parts[0][0] !== '/') {
                    parts[0] = path.resolve(path.dirname(file.subpath), parts[0]);
                }

                return 'href=\\' + quota + parts.join('#') + '\\' + quota;
            }

            return _;
        });
    }],
    isMod: true
});

fis.match('{*.jsx,*.tsx,/src/**.js,/src/**.ts}', {
    parser: [fis.plugin('typescript', {
        importHelpers: true,
        experimentalDecorators: true,
        sourceMap: true
    }),

    function (content) {
        return content.replace(/\b[a-zA-Z_0-9$]+\.__uri\s*\(/g, '__uri(')
    }],
    preprocessor: fis.plugin('js-require-css'),
    isMod: true,
    rExt: '.js'
});

fis.match('*.html:jsx', {
    parser: fis.plugin('typescript'),
    rExt: '.js',
    isMod: false
});

fis.match('monaco-editor/**.js', {
    isMod: false,
    standard: null
});

fis.match('/node_modules/monaco-editor/min/(**)', {
    standard: false,
    isMod: false,
    packTo: null,
    optimizer: false,
    postprocessor: function (content, file) {
        if (!file.isJsLike || /worker/.test(file.basename)) {
            return content;
        }

        content = content.replace(/\bself\.require\b/g, 'require || self.require');

        return '(function(define, require) {\n' + content
        + '\n})(this.monacaAmd && this.monacaAmd.define || this.define, this.monacaAmd && this.monacaAmd.require);';
    }
});
fis.match('/node_modules/monaco-editor/min/**/loader.js', {
    postprocessor: function (content) {
        return '(function(self) {\n' + content + '\n}).call(this.monacaAmd || (this.monacaAmd = {}));';
    }
});

fis.match('::package', {
    postpackager: fis.plugin('loader', {
        useInlineMap: false,
        resourceType: 'mod'
    })
});

fis.hook('node_modules', {
    shimProcess: false,
    shimGlobal: false,
    shimBuffer: false
});
fis.hook('commonjs', {
    extList: ['.js', '.jsx', '.tsx', '.ts']
});

fis
    .media('dev')
    .match('/node_modules/**.js', {
        packTo: '/pkg/npm.js'
    })
    .match('monaco-editor/**.js', {
        packTo: null
    });


if (fis.project.currentMedia() === 'publish') {
    const publishEnv = fis.media('publish');
    publishEnv.get('project.ignore').push(
        'lib/**'
    );
    publishEnv.set('project.files', [
        '/scss/**',
        '/src/**'
    ]);

    publishEnv.match('/scss/(**)', {
        release: '/$1',
        relative: true
    });

    publishEnv.match('/src/(**)', {
        release: '/$1',
        relative: true
    });

    publishEnv.match('/node_modules/monaco-editor/min/(**)', {
        release: '/thirds/monaco-editor/$1'
    });

    publishEnv.match('/src/**.{jsx,tsx,js,ts}', {
        parser: [
            fis.plugin('typescript', {
                importHelpers: true,
                sourceMap: true,
                experimentalDecorators: true
            }),
            function (contents) {
                return contents.replace(/(?:\w+\.)?\b__uri\s*\(\s*('|")(.*?)\1\s*\)/g, function (_, quote, value) {
                    let str = quote +  value +  quote;
                    return '(function(){try {return __uri(' + str + ')} catch(e) {return ' + str + '}})()';
                });
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
    publishEnv.match('/src/**.{jsx,tsx,js,ts}', {
        isMod: false,
        standard: false
    });

    publishEnv.match('/src/components/Editor.tsx', {
        standard: 'builtin'
    });

    publishEnv.match('/src/**.{jsx,tsx,js,ts}', {
        postprocessor: function (content, file) {
            return content.replace(/^''/mg, '').replace(/\/\/# sourceMappingURL=\//g, '//# sourceMappingURL=./');
        }
    });
    publishEnv.match('*.scss', {
        postprocessor: function (content, file) {
            return content.replace(/\/\*# sourceMappingURL=\//g, '/*# sourceMappingURL=./');
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
                if (subpath === '/src/components/Editor.tsx') {
                    content = content
                        .replace('require("node_modules/tslib/tslib")', 'require("tslib")')
                        .replace('require("node_modules/react/index")', 'require("react")')
                        .replace('require("node_modules/classnames/index")', 'require("classnames")')
                        .replace('require("src/themes/default.ts")', 'require("../themes/default.js")')
                        .replace('require("src/theme.tsx")', 'require("../theme.js")')
                        .replace(/('|")(\.\.\/thirds.*?)\1/g, function (_, quote, value) {
                            return '__uri(' + quote + value + quote + ')';
                        });
                } else {
                    content = content.replace(/@require\s+(?:\.\.\/)?node_modules\//g, '@require ');
                }
                file.setContent(content);
            });
        }
    });
    // publishEnv.unhook('node_modules');
    publishEnv.hook('relative');
} else if (fis.project.currentMedia() === 'gh-pages') {
    const ghPages = fis.media('gh-pages');

    ghPages.match('/docs/**.md', {
        rExt: 'js',
        parser: [parserMarkdown, function(contents, file) {
            return contents.replace(/\bhref=\\('|")(.+?)\\\1/g, function(_, quota, link) {
                if (/\.md($|#)/.test(link)) {
                    let parts = link.split('#');
                    parts[0] = parts[0].replace('.md', '');
    
                    if (parts[0][0] !== '/') {
                        parts[0] = path.resolve(path.dirname(file.subpath), parts[0]);
                    }
    
                    return 'href=\\' + quota + '#' + parts.join('#') + '\\' + quota;
                }
    
                return _;
            });
        }],
        isMod: true
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
                .replace(/(\\?(?:'|"))((?:get|post|delete|put)\:)?\/api\/mock2?/ig, function(_, qutoa, method) {
                    return qutoa + (method || '') +  'https://houtai.baidu.com/api/mock2';
                })
                .replace(/(\\?(?:'|"))((?:get|post|delete|put)\:)?\/api\/sample/ig, function(_, qutoa, method) {
                    return qutoa + (method || '') +  'https://houtai.baidu.com/api/sample';
                });
        }
    })
    
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
                '!amis/lib/editor/**',
                '!froala-editor/**',
                '!amis/lib/components/RichText.js',
                '!jquery/**',
                '!zrender/**',
                '!echarts/**',
            ],
            'pkg/rich-text.js': [
                'amis/lib/components/RichText.js',
                'froala-editor/**',
                'jquery/**'
            ],
            'pkg/echarts.js': [
                'zrender/**',
                'echarts/**'
            ],
            'pkg/api-mock.js': [
                'mock/*.ts'
            ],
            'pkg/app.js': [
                '/examples/components/App.jsx',
                '/examples/components/App.jsx:deps'
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
                '!echarts/**',
            ],
            // css 打包
            'pkg/style.css': [
                'node_modules/*/**.css',
                '*.scss',
                '!/scss/*.scss',
                '/scss/*.scss',
                '!monaco-editor/**',
            ]
        })
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
        moduleId: function (m, path) {
            return fis.util.md5('amis' + path);
        },
        parser: fis.plugin('typescript', {
            sourceMap: false,
            importHelpers: true
        })
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
    ghPages.match('{*.min.js,monaco-editor/**.js}', {
        optimizer: null
    });
    ghPages.match('monaco-editor/**', {
        useHash: false
    });
}
