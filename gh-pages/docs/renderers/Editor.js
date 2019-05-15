define('docs/renderers/Editor.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"editor\" href=\"#editor\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Editor</h3><h3><a class=\"anchor\" name=\"xxx-editor\" href=\"#xxx-editor\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>XXX-Editor</h3><ul>\n<li><code>type</code> 请设置成 <code>editor</code> 或者 <code>bat-editor</code>、<code>c-editor</code>、<code>coffeescript-editor</code>、<code>cpp-editor</code>、<code>csharp-editor</code>、<code>css-editor</code>、<code>dockerfile-editor</code>、<code>fsharp-editor</code>、<code>go-editor</code>、<code>handlebars-editor</code>、<code>html-editor</code>、<code>ini-editor</code>、<code>java-editor</code>、<code>javascript-editor</code>、<code>json-editor</code>、<code>less-editor</code>、<code>lua-editor</code>、<code>markdown-editor</code>、<code>msdax-editor</code>、<code>objective-c-editor</code>、<code>php-editor</code>、<code>plaintext-editor</code>、<code>postiats-editor</code>、<code>powershell-editor</code>、<code>pug-editor</code>、<code>python-editor</code>、<code>r-editor</code>、<code>razor-editor</code>、<code>ruby-editor</code>、<code>sb-editor</code>、<code>scss-editor</code>、<code>sol-editor</code>、<code>sql-editor</code>、<code>swift-editor</code>、<code>typescript-editor</code>、<code>vb-editor</code>、<code>xml-editor</code>、<code>yaml-editor</code>。</li>\n<li><code>language</code> 默认为 <code>javascript</code> 当 <code>type</code> 为 <code>editor</code> 的时候有用。</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"form-item\">{\n  \"type\": \"json-editor\",\n  \"name\": \"json\",\n  \"label\": \"Json Editor\"\n}\n</script></div>\n<h3><a class=\"anchor\" name=\"diff-editor\" href=\"#diff-editor\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Diff-Editor</h3><ul>\n<li><code>type</code> 请设置成 <code>diff-editor</code></li>\n<li><code>language</code> 默认为 <code>javascript</code> 当 <code>type</code> 为 <code>diff-editor</code> 的时候有用</li>\n<li><code>diffValue</code> 设置左侧编辑器的值，支持<code>${xxx}</code>获取变量</li>\n<li><code>disabled</code> 配置 <strong>右侧编辑器</strong> 是否可编辑，<strong>左侧编辑器</strong>始终不可编辑</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<p>PS: 当用作纯展示时，可以通过<code>value</code>配置项，设置右侧编辑器的值</p>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"form-item\">{\n  \"type\": \"diff-editor\",\n  \"name\": \"diff\",\n  \"diffValue\": \"hello world\",\n  \"label\": \"Diff-Editor\"\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Editor",
          "fragment": "editor",
          "fullPath": "#editor",
          "level": 3
        },
        {
          "label": "XXX-Editor",
          "fragment": "xxx-editor",
          "fullPath": "#xxx-editor",
          "level": 3
        },
        {
          "label": "Diff-Editor",
          "fragment": "diff-editor",
          "fullPath": "#diff-editor",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
