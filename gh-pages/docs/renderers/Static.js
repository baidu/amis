define('docs/renderers/Static.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"static\" href=\"#static\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Static</h3><p>纯用来展现数据的。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>static</code></li>\n<li><code>name</code> 变量名。</li>\n<li><code>value</code> 值，可以通过它设置默认值。</li>\n<li><code>label</code> 描述标题，当表单为水平布局时，左边即便是不设置 label 为了保持对齐也会留空，如果想要去掉空白，请设置成 <code>false</code>。</li>\n<li><code>description</code> 描述内容。</li>\n<li><code>placeholder</code> 占位内容，默认 <code>-</code>。</li>\n<li><code>inline</code> 是否为 inline 模式。</li>\n<li><code>className</code> 表单最外层类名。</li>\n<li><code>visible</code> 是否可见。</li>\n<li><code>visibleOn</code> 通过<a href=\"#/docs/renderers/Types#表达式\">表达式</a>来配置当前表单项是否显示。</li>\n<li><code>hidden</code> 是否隐藏，不要跟 <code>visible</code> <code>visibleOn</code> 同时配置</li>\n<li><code>hiddenOn</code> 通过<a href=\"#/docs/renderers/Types#表达式\">表达式</a>来配置当前表单项是否隐藏。</li>\n<li><code>inputClassName</code> 表单控制器类名。</li>\n<li><code>labelClassName</code> label 的类名。</li>\n<li><code>tpl</code> 如果想一次展示多条数据，可以考虑用 <code>tpl</code>，模板引擎是 lodash template，同时你还可以简单用 <code>$</code> 取值。 具体请查看 <a href=\"#/docs/renderers/Tpl\">tpl</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form-item\">{\n  \"type\": \"static\",\n  \"name\": \"select\",\n  \"label\": \"Label\",\n  \"value\": \"A\"\n}\n</script></div>\n<h3><a class=\"anchor\" name=\"static-xxx\" href=\"#static-xxx\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Static-XXX</h3><ul>\n<li><code>type</code> 请设置成 <code>static-tpl</code>、<code>static-plain</code>、<code>static-json</code>、<code>static-date</code>、<code>static-datetime</code>、<code>static-time</code>、<code>static-mapping</code>、<code>static-image</code>、<code>static-progress</code>、<code>static-status</code>或者<code>static-switch</code></li>\n</ul>\n<p>纯用来展示数据的，用法跟 crud 里面的<a href=\"#/docs/renderers/.Column\">Column</a>一样, 且支持 quickEdit 和 popOver 功能。</p>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form-item\">{\n  \"type\": \"static-json\",\n  \"name\": \"json\",\n  \"label\": \"Label\",\n  \"value\": {\n    \"a\":\"dd\",\n    \"b\":\"asdasd\"\n  }\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Static",
          "fragment": "static",
          "fullPath": "#static",
          "level": 3
        },
        {
          "label": "Static-XXX",
          "fragment": "static-xxx",
          "fullPath": "#static-xxx",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
