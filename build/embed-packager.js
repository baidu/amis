/* eslint-disable */

var rLinkScript = /(<!(?:--)?\[[\s\S]*?<\!\[endif\](?:--)?>|<!--[\s\S]*?(?:-->|$))|(?:(\s*<script([^>]*)>([\s\S]*?)<\/script>)|(?:\s*(<link([^>]*?)(?:\/)?>)|(<style([^>]*)>([\s\S]*?)<\/style>)))(<!--ignore-->)?\n?/ig;
var rScriptType = /type=('|")(.*?)\1/i;
var rSrcHref = /\s*(?:src|href)=('|")(.+?)\1/i;
var rRefStyle = /rel=('|")stylesheet\1/i;
var path = require('path');
var css = require('css');
var rSourceMap = /(?:\/\/\#\s*sourceMappingURL[^\r\n\'\"]*|\/\*\#\s*sourceMappingURL[^\r\n\'\"]*\*\/)(?:\r?\n|$)/ig;
var caches = {};
var createResource = fis.require('postpackager-loader/lib/resource.js');

function prefixCss(code, prefix) {
    var cssAst = css.parse(code);
    prefixNode(cssAst);
    return css.stringify(cssAst) + '\n' + prefix + '{background-color: #f0f3f4;position: relative;} \n' + prefix + ' .app {padding-bottom:0;}';

    function prefixSelector(sel){
        if (sel.match(/^@/)) return sel;
        var m = sel.match(/(^| )(body|html)($|\W.*)/i);
        if (m)
            return m[1] + prefix + m[3];
        else if (sel.match(/^(?:\.fr-|\.fa)/))
            return sel;
        else
            return prefix + ' ' + sel;
    }

    function prefixNode(node) {
        if (node.selectors) {
            node.selectors = node.selectors.map(prefixSelector);
        } else if (node.stylesheet) {
            node.stylesheet.rules.forEach(prefixNode);
        } else if (node.rules) {
            node.rules.forEach(prefixNode);
        }
    }
}

function replaceSrc(code) {
    var cssAst = css.parse(code);
    let count = 0;
    replaceNode(cssAst);
    return css.stringify(cssAst);

    function replaceDeclaration(sel) {
        if (sel.property == 'src' && ~sel.value.indexOf('url')) {
            sel.value = sel.value.replace(/\/sdk/g, '.');
        }
        return sel;
    }

    function replaceNode(node) {
        // font-awesome的在 1 个 declarations中， bootstrap 的字体路径在 58 declarations中，后续的就不再遍历了，直接返回
        if (count >= 58) return node;
        if (node.declarations) {
            count++;
            node.declarations = node.declarations.map(replaceDeclaration);
        } else if (node.stylesheet) {
            node.stylesheet.rules.forEach(replaceNode);
        } else if (node.rules) {
            node.rules.forEach(replaceNode);
        }
    }
}

function unicodeJs(str) {
    return str.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[\u2019])/g, function(_, value){
        return '\\u' + value.charCodeAt(0).toString(16);
    });
}

module.exports = function (ret, pack, settings, opt) {
    var root = fis.project.getProjectPath();

    var tpl = ret.pkg['/examples/embed.tpl'];

    if (tpl && tpl._fromCache && caches[tpl.id]) {
        tpl.setContent(caches[tpl.id]);
        return;
    } else if (!tpl) {
        return;
    }

    var mapping = {};
    var contents = tpl.getContent();
    var cssContents = '';
    var jsContents = '';
    var entryJs = '';
    var resource = tpl._resource;

    var files = ret.pkg;
    Object.keys(files).forEach(function (subpath) {
        var file = files[subpath];

        mapping[file.getUrl()] = file;
    });

    contents.replace(rLinkScript, function (all, comment, script, attrs, body, link, lattrs, style, sattrs, sbody, ignored) {
        // 忽略注释。
        if (comment || ignored) {
            return all;
        }

        if (script && !body.trim() && rSrcHref.test(attrs)) {
            all = '';
        } else if (script && !rScriptType.test(attrs) || rScriptType.test(attrs) && ~['text/javascript', 'application/javascript'].indexOf(RegExp.$2.toLowerCase())) {
            entryJs += ';' + body;
            all = '';
        } else if (link && rRefStyle.test(lattrs) && rSrcHref.test(lattrs)) {
            var href = RegExp.$2;
            let file = resource.getFileByUrl(href);

            if (!file) {
                file = resource.getFileByUrl(fis.util(path.join(path.dirname(tpl.release), href)));
            }

            if (!file) {
                file = mapping[href];
            }


            if (file && (file.filename === 'font-awesome' || file.filename === 'bootstrap')) {
                let content = replaceSrc(file.getContent())
                cssContents += '\n' + content;
            } else {
                file && (cssContents += '\n' + file.getContent());
            }
            all = '';
        } else if (style && sbody.trim()) {
            cssContents += sbody;
            all = '';
        }

        return all;
    });

    (function (file, ret) { // tpl ret
        var resource = createResource(ret, file, {});
        var asyncJsContents = '';

        file.requires.forEach(function(id) {
            resource.add(id);
        });

        file.asyncs.forEach(function(id) {
            resource.add(id, true);
        });

        var loaded = resource.loaded;
        var res = {};
        var pkg = {};

        Object.keys(loaded).forEach(function (id) {
            if (!/\.(jsx|tsx|js|ts)?$/.test(id)) {
                return;
            }
            var file = resource.getFileById(id);
            var isAsync = loaded[id];

            if (file) {
                if (isAsync) {
                    asyncJsContents += ';/*!' +id+ '*/\n' + file.getContent();

                    var node = resource.getNode(id);
                    if (node.type !== 'js') {
                        return;
                    }

                    var item = {
                        type: node.type
                    };

                    if (node.deps) {

                        // 过滤掉不是 js 的文件依赖。
                        var deps = node.deps.filter(function(id) {
                            if (resource.loaded[id] !== false) {
                                var dep = resource.getFileById(id);

                                if (dep) {
                                    return dep.isJsLike;
                                }
                            }

                            return false;
                        });

                        if (deps.length) {
                            deps.forEach(function(v, k) {
                                var dep = resource.getFileById(v);

                                if (dep && dep.moduleId) {
                                    deps[k] = dep.moduleId;
                                } else {
                                    deps[k] = v.replace(/\.(es6|jsx|tsx|ts|coffee)$/g, '.js');
                                }

                            });
                            item.deps = deps;
                        }
                    }

                    var moduleId = node.extras && node.extras.moduleId || file && file.moduleId || id.replace(/\.js$/i, '');
                    res[moduleId] = item;

                } else {
                    jsContents += ';/*!' +id+ '*/\n' + file.getContent();
                }
            }
        });

        var modjs = resource.getFileByUrl('/examples/mod.js');
        var resouceMap = '';
        var asyncPkgs = {};

        if (asyncJsContents) {
            asyncJsContents = asyncJsContents.replace(rSourceMap, '');
            asyncJsContents = unicodeJs(asyncJsContents);

            let asyncJsFile = fis.file(root + '/sdk/', tpl.filename + '_aio_async.js');
            asyncJsFile.setContent(asyncJsContents);
            ret.pkg[asyncJsFile.subpath] = asyncJsFile;

            Object.keys(res).forEach(function (moduleId) {
                res[moduleId].pkg = 'paio';
            });

            pkg['paio'] = {
                uri: asyncJsFile.filename + '.js',
                type: 'js'
            };

            asyncPkgs = {res: res, pkg: pkg};
        }

        resouceMap = `(function(){
            var dirname = '';
            try {
                throw new Error()
            } catch (e) {
                const stackPath = e.stack.substring(0, e.stack.indexOf('embed'));
                const rgx = /(?<=.)(http|https|file).*/;
                dirname = (rgx.exec(stackPath)||[])[0] || '';
            }
            var config = ${JSON.stringify(asyncPkgs)};
            var pkg = config.pkg;
            Object.keys(pkg).forEach(function(key){
              if (pkg[key].uri) {
                pkg[key].uri = dirname + pkg[key].uri;
              }
            });
            amis.require.resourceMap(config);
        })();`;
        jsContents = modjs.getContent() + '\n' + resouceMap + '\n' + jsContents;
    })(tpl, ret);

    jsContents = jsContents.replace(rSourceMap, '');
    jsContents = unicodeJs(jsContents);

    let jsFile = fis.file(root + '/sdk/', tpl.filename + '_aio.js');
    jsFile.setContent(jsContents);
    ret.pkg[jsFile.subpath] = jsFile;

    cssContents = prefixCss(cssContents, '.amis-scope');
    let cssFile = fis.file(root + '/sdk/', tpl.filename + '_aio.css');
    cssFile.setContent(cssContents);
    ret.pkg[cssFile.subpath] = cssFile;
    entryJs = entryJs.replace(/[\r\n]/g, '').replace(/"/g, '\\"');
    contents = "(function(css, js) {"+entryJs+"})('" + cssFile.getUrl() +"', '" + jsFile.getUrl() + "')";
    contents += '\n// jsurl=' + jsFile.getUrl();
    contents += '\n// cssurl=' + cssFile.getUrl();

    tpl.setContent(contents);
    caches[tpl.id] = contents;
};
