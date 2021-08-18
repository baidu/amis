/* eslint-disable */

var rLinkScript = /(<!(?:--)?\[[\s\S]*?<\!\[endif\](?:--)?>|<!--[\s\S]*?(?:-->|$))|(?:(\s*<script([^>]*)>([\s\S]*?)<\/script>)|(?:\s*(<link([^>]*?)(?:\/)?>)|(<style([^>]*)>([\s\S]*?)<\/style>)))(<!--ignore-->)?\n?/gi;
var rScriptType = /type=('|")(.*?)\1/i;
var rSrcHref = /\s*(?:src|href)=('|")(.+?)\1/i;
var rRefStyle = /rel=('|")stylesheet\1/i;
var path = require('path');
var css = require('css');
var rSourceMap = /(?:\/\/\#\s*sourceMappingURL[^\r\n\'\"]*|\/\*\#\s*sourceMappingURL[^\r\n\'\"]*\*\/)(?:\r?\n|$)/gi;
var caches = {};
var createResource = fis.require('postpackager-loader/lib/resource.js');

function prefixCss(code, prefix) {
  var cssAst = css.parse(code);
  prefixNode(cssAst);
  return css.stringify(cssAst);

  function prefixSelector(sel) {
    if (sel.match(/^@/)) return sel;
    if (sel.match(/^:root/)) return sel;
    var m = sel.match(/(^| )(body|html)($|\W.*)/i);
    if (m) return m[1] + prefix + m[3];
    else if (sel.match(/^\.is\-modalOpened/))
      return sel.replace(
        /^\.is\-modalOpened\s/,
        '.is-modalOpened ' + prefix + ' '
      );
    else if (
      sel.match(
        /^(?:\.fr-|\.fa|\.tox|\.monaco-|\.vs-dark|\.hc-black|\.vs\b|\.cursor-|::|\.context-view|\.menubar|\.fullscreen|\.colorpicker-)/
      )
    )
      return sel;
    else return prefix + ' ' + sel;
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

function unicodeJs(str) {
  return str.replace(
    /([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[\u2019])/g,
    function (_, value) {
      return '\\u' + value.charCodeAt(0).toString(16);
    }
  );
}

module.exports = function (ret, pack, settings, opt) {
  var root = fis.project.getProjectPath();

  var tpl = ret.pkg['/examples/sdk-placeholder.html'];
  tpl.skiped = true;

  if (tpl && tpl._fromCache && caches[tpl.id]) {
    tpl.setContent(caches[tpl.id]);
    return;
  } else if (!tpl) {
    return;
  }

  var mapping = {};
  var contents = tpl.getContent();
  var cssContents = [];
  var jsContents = '';
  var entryJs = '';
  var resource = tpl._resource;

  var files = ret.pkg;
  Object.keys(files).forEach(function (subpath) {
    var file = files[subpath];

    mapping[file.getUrl()] = file;
  });

  contents.replace(
    rLinkScript,
    function (
      all,
      comment,
      script,
      attrs,
      body,
      link,
      lattrs,
      style,
      sattrs,
      sbody,
      ignored
    ) {
      // 忽略注释。
      if (comment || ignored) {
        return all;
      }

      if (script && !body.trim() && rSrcHref.test(attrs)) {
        all = '';
        let src = RegExp.$2;
        let file = resource.getFileByUrl(src);

        if (!file) {
          file = resource.getFileByUrl(
            fis.util(path.join(path.dirname(tpl.release), src))
          );
        }

        if (!file) {
          file = mapping[src];
        }

        if (file) {
          file.skiped = true;
          let contents = file.getContent();

          if (/_map\.js$/.test(file.subpath)) {
            contents = `(function() {
    var d = '';
    try {
        throw new Error()
    } catch (e) {
        d = (/((?:https?|file):.*?)\\n/.test(e.stack) && RegExp.$1).replace(/\\/[^\\/]*$/, '');
    }
    amis.host = d;
    ${contents.replace(
      /\"url\"\s*\:\s*('|")(\.\/.*?)\1/g,
      function (_, quote, value) {
        return `"url": d + ${quote}${value.substring(1)}${quote}`;
      }
    )}
        })()`;
          }
          jsContents += contents + ';\n';
        }
      } else if (
        (script && !rScriptType.test(attrs)) ||
        (rScriptType.test(attrs) &&
          ~['text/javascript', 'application/javascript'].indexOf(
            RegExp.$2.toLowerCase()
          ))
      ) {
        entryJs += ';' + body;
        all = '';
      } else if (link && rRefStyle.test(lattrs) && rSrcHref.test(lattrs)) {
        var href = RegExp.$2;
        let file = resource.getFileByUrl(href);

        if (!file) {
          file = resource.getFileByUrl(
            fis.util(path.join(path.dirname(tpl.release), href))
          );
        }

        if (!file) {
          file = mapping[href];
        }

        if (file) {
          cssContents.push({
            name: file.basename,
            content: file.getContent()
          });
          file.skiped = true;
        }
        all = '';
      } else if (style && sbody.trim()) {
        cssContents.push({
          name: 'inline',
          content: sbody
        });
        all = '';
      }

      return all;
    }
  );

  jsContents = jsContents.replace(rSourceMap, '');
  jsContents = unicodeJs(jsContents);

  let jsFile = fis.file(root, 'sdk.js');
  jsFile.setContent(jsContents);
  ret.pkg[jsFile.subpath] = jsFile;

  // cssContents = prefixCss(cssContents, '.amis-scope');
  // let cssFile = fis.file(root, 'sdk.css');
  // cssFile.setContent(cssContents);
  // ret.pkg[cssFile.subpath] = cssFile;

  const themes = ['ang', 'cxd', 'dark', 'antd'];

  themes.forEach(function (theme) {
    const rest = themes.filter(a => a !== theme).map(item => item + '.scss');
    let contents = cssContents
      .filter(item => !rest.includes(item.name))
      .map(item => item.content)
      .join('\n');

    contents = prefixCss(contents, '.amis-scope');
    let cssFile = fis.file(root, (theme === 'cxd' ? 'sdk' : theme) + '.css');
    cssFile.setContent(contents);
    ret.pkg[cssFile.subpath] = cssFile;
  });

  // tpl.setContent(contents);
  caches[tpl.id] = contents;
};
