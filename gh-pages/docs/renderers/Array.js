define('docs/renderers/Array.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"array\" href=\"#array\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Array</h3><p>数组输入框配置</p>\n<p>其实就是 <a href=\"#/docs/renderers/Combo\">Combo</a> 的一个 flat 用法。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>array</code></li>\n<li><code>items</code> 配置单项表单类型</li>\n<li><code>addable</code> 是否可新增。</li>\n<li><code>removable</code> 是否可删除</li>\n<li><code>draggable</code> 默认为 <code>false</code>, 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个\\$id 字段</li>\n<li><code>draggableTip</code> 可拖拽的提示文字，默认为：<code>&quot;可通过拖动每行中的【交换】按钮进行顺序调整&quot;</code></li>\n<li><code>addButtonText</code> 新增按钮文字，默认为 <code>&quot;新增&quot;</code>。</li>\n<li><code>minLength</code> 限制最小长度。</li>\n<li><code>maxLength</code> 限制最大长度。</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 650px\"><script type=\"text/schema\" height=\"650\" scope=\"form\">[\n  {\n    \"name\": \"array\",\n    \"label\": \"颜色集合\",\n    \"type\": \"array\",\n    \"value\": [\"red\"],\n    \"inline\": true,\n    \"items\": {\n      \"type\": \"color\"\n    }\n  },\n\n  {\n    \"type\": \"static\",\n    \"name\": \"array\",\n    \"label\": \"当前值\"\n  }\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Array",
          "fragment": "array",
          "fullPath": "#array",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
