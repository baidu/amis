/* eslint-disable */

var marked = require('marked');
let prism = require('prismjs');
let loadLanguages = require('prismjs/components/');
loadLanguages([
  'bash',
  'javascript',
  'java',
  'python',
  'jsx',
  'tsx',
  'css',
  'markup',
  'json'
]);
var yaml = (yaml = require('js-yaml'));
var rYml = /^\s*---([\s\S]*?)---\s/;
var renderer = new marked.Renderer();
marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  smartLists: true,
  smartypants: false
});

// Synchronous highlighting with prism.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  }
});

// renderer.table = function(header, body) {
//   return '<table class="table table-striped">\n'
//     + '<thead>\n'
//     + header
//     + '</thead>\n'
//     + '<tbody>\n'
//     + body
//     + '</tbody>\n'
//     + '</table>\n';
// };

renderer.link = function (href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  if (href && href[0] === '#') {
    href =
      '#' +
      encodeURIComponent(
        href
          .substring(1)
          .toLowerCase()
          .replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]+/g, '-')
      );
  }

  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

module.exports = function (content, file) {
  var m = rYml.exec(content);
  var info = {};
  if (m && m[1]) {
    info = yaml.load(m[1]);
    content = content.substring(m[0].length);
  }

  var toc = {
    label: '目录',
    type: 'toc',
    children: [],
    level: 0
  };
  var stack = [toc];

  renderer.heading = function (text, level) {
    var escapedText = encodeURIComponent(
      text.toLowerCase().replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]+/g, '-')
    );

    if (level < 5) {
      var menu = {
        label: text,
        fragment: escapedText,
        fullPath: '#' + escapedText,
        level: level
      };

      while (stack.length && stack[0].level >= level) {
        stack.shift();
      }

      stack[0].children = stack[0].children || [];
      stack[0].children.push(menu);

      stack.unshift(menu);
    }

    var anchor =
      '<a class="anchor" name="' +
      escapedText +
      '" href="#' +
      escapedText +
      '" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>';

    return '<h' + level + '>' + anchor + text + '</h' + level + '>';

    // return '<h' + level + '><a name="' +
    //   escapedText +
    //   '" class="anchor" href="#' +
    //   escapedText +
    //   '"><span class="header-link"></span></a>' +
    //   text + '</h' + level + '>';
  };

  const placeholder = {};
  let index = 1;

  content = content
    .replace(/\!\!\!include\s*\(([^\)]+?)\)\!\!\!/g, (_, val) => {
      const result = fis.project.lookup(val, file);

      if (result) {
        // 暂时不支持嵌套 include
        return result.file.getContent();
      }

      return _;
    })
    .replace(
      /```(schema|html)(?::(.*?))?\n([\s\S]*?)```/g,
      function (_, lang, attr, code) {
        const setting = {};
        attr &&
          attr.split(/\s+/).forEach(function (item) {
            var parts = item.split('=');

            if (parts[1] && /^('|").*\1/.test(parts[1])) {
              parts[1] = parts[1].substring(1, parts[1].length - 1);
            }

            setting[parts[0]] = parts[1] ? decodeURIComponent(parts[1]) : '';

            if (parts[0] === 'height') {
              setting.height = parseInt(setting.height, 10) /*编辑器的高度*/;
              attr = attr.replace(item, `height="${setting.height}"`);
            }
          });

        // placeholder[index] = `<iframe class="doc-iframe" width="100%" height="${setting.height || 200}px" frameBorder="0" src="/play?code=${encodeURIComponent(code)}&scope=${encodeURIComponent(setting.scope)}"></iframe>`;
        if (lang === 'html') {
          if (~code.indexOf('<html') || ~code.indexOf('<link')) {
            return _;
          }

          placeholder[
            index
          ] = `<!--amis-preview-start--><div class="amis-doc"><div class="preview">${code}</div><pre><code class="lang-html">${prism.highlight(
            code
              .replace(/"data:(\w+\/\w+);.*?"/g, '"data:$1; ..."')
              .replace(/<svg([^>]*)>[\s\S]*?<\/svg>/g, '<svg$1>...</svg>')
              .replace(/class="([^"]*?)\.\.\.([^"]*?)"/g, 'class="$1..."'),
            prism.languages[lang],
            lang
          )}</code></pre></div><!--amis-preview-end-->`;
        } else {
          placeholder[
            index
          ] = `<!--amis-preview-start--><div class="amis-preview" style="min-height: ${setting.height}px"><script type="text/schema" ${attr}>${code}</script></div><!--amis-preview-end-->`;
        }

        return `[[${index++}]]`;
      }
    );

  content = marked
    .parse(content)
    .replace(/<p>\[\[(\d+)\]\]<\/p>/g, function (_, id) {
      return placeholder[id] || '';
    });

  content = fis.compile.partial(content, file, 'html');
  // + `\n\n<div class="m-t-lg b-l b-info b-3x wrapper bg-light dk">文档内容有误？欢迎大家一起来编写，文档地址：<i class="fa fa-github"></i><a href="https://github.com/baidu/amis/tree/master${file.subpath}">${file.subpath}</a>。</div>`;
  info.html =
    '<div class="markdown-body">' +
    content.replace(
      /<\!\-\-amis\-preview\-(start|end)\-\-\>/g,
      function (_, type) {
        return type === 'start' ? '</div>' : '<div class="markdown-body">';
      }
    ) +
    '</div>';
  info.toc = toc;

  return 'module.exports = ' + JSON.stringify(info, null, 2) + ';';
};
