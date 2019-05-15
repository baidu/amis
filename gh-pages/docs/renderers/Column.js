define('docs/renderers/Column.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"column\" href=\"#column\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Column</h3><p>表格中的列配置</p>\n<ul>\n<li><code>type</code> 默认为 <code>text</code>，支持： <code>text</code>、<code>html</code>、<code>tpl</code>、<code>image</code>、<code>progress</code>、<code>status</code>、<code>date</code>、<code>datetime</code>、<code>time</code>、<code>json</code>、<code>mapping</code>参考 <a href=\"#/docs/renderers/Field\">Field 说明</a>和<a href=\"#/docs/renderers/Operation\">Operation</a>。</li>\n<li><code>name</code> 用来关联列表数据中的变量 <code>key</code>。</li>\n<li><code>label</code> 列标题。</li>\n<li><code>copyable</code> 开启后，会支持内容点击复制。</li>\n<li><code>width</code> 列宽度。</li>\n<li><code>popOver</code> 是否支持点击查看详情。当内容较长时，可以开启此配置。</li>\n<li><code>quickEdit</code> 配置后在内容区增加一个编辑按钮，点击后弹出一个编辑框。</li>\n<li><code>toggled</code> 控制默认是展示还是不展示，只有 Table 的 <code>columnsTogglable</code> 开启了才有效。</li>\n</ul>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Column",
          "fragment": "column",
          "fullPath": "#column",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
