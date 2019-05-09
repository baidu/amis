/**
 * @file fis-conf.js 配置
 */
const path = require('path');
const parserMarkdown = require('./build/md-parser');
fis.get('project.ignore').push(
    'public/**',
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
}
