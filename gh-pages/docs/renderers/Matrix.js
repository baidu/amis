define('docs/renderers/Matrix.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"matrix\" href=\"#matrix\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Matrix</h3><p>矩阵类型的输入框。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>matrix</code></li>\n<li><code>columns</code> 列信息， 数组中 <code>label</code> 字段是必须给出的</li>\n<li><code>rows</code> 行信息， 数组中 <code>label</code> 字段是必须给出的</li>\n<li><code>rowLabel</code> 行标题说明</li>\n<li><code>source</code> Api 地址，如果选项不固定，可以通过配置 <code>source</code> 动态拉取。</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form-item\">{\n  \"type\": \"matrix\",\n  \"name\": \"matrix\",\n  \"label\": \"Matrix\",\n  \"rowLabel\": \"行标题说明\",\n  \"columns\": [\n    {\n      \"label\": \"列1\"\n    },\n    {\n      \"label\": \"列2\"\n    }\n  ],\n  \"rows\": [\n    {\n      \"label\": \"行1\"\n    },\n    {\n      \"label\": \"行2\"\n    }\n  ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Matrix",
          "fragment": "matrix",
          "fullPath": "#matrix",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
