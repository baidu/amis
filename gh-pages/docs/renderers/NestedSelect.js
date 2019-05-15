define('docs/renderers/NestedSelect.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"nestedselect\" href=\"#nestedselect\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>NestedSelect</h3><p>树形结构选择框。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>nested-select</code></li>\n<li><code>options</code> 类似于 <a href=\"#/docs/renderers/Select\">select</a> 中 <code>options</code>, 并且支持通过 <code>children</code> 无限嵌套。</li>\n<li><code>source</code> Api 地址，如果选项不固定，可以通过配置 <code>source</code> 动态拉取。</li>\n<li><code>multiple</code> 默认为 <code>false</code>, 设置成 <code>true</code> 表示可多选。</li>\n<li><code>joinValues</code> 默认为 <code>true</code></li>\n<li>单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。</li>\n<li>多选模式：选中的多个选项的 <code>value</code> 会通过 <code>delimiter</code> 连接起来，否则直接将以数组的形式提交值。</li>\n<li><code>extractValue</code> 默认为 <code>false</code>, <code>joinValues</code>设置为<code>false</code>时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。</li>\n<li><code>delimiter</code> 默认为 <code>,</code></li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"form-item\">{\n  \"type\": \"nested-select\",\n  \"name\": \"nestedSelect\",\n  \"label\": \"级联选择器\",\n  \"size\": \"sm\",\n  \"options\": [\n      {\n          \"label\": \"A\",\n          \"value\": \"a\"\n      },\n      {\n          \"label\": \"B\",\n          \"value\": \"b\",\n          \"children\": [\n              {\n                  \"label\": \"B-1\",\n                  \"value\": \"b-1\"\n              },\n              {\n                  \"label\": \"B-2\",\n                  \"value\": \"b-2\"\n              },\n              {\n                  \"label\": \"B-3\",\n                  \"value\": \"b-3\"\n              }\n          ]\n      },\n      {\n          \"label\": \"C\",\n          \"value\": \"c\"\n      }\n  ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "NestedSelect",
          "fragment": "nestedselect",
          "fullPath": "#nestedselect",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
