define('docs/renderers/Form/Range.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"range\" href=\"#range\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Range</h2><p>范围输入框。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>range</code></li>\n<li><code>min</code> 最小值</li>\n<li><code>max</code> 最大值</li>\n<li><code>step</code> 步长</li>\n<li><code>multiple</code> 支持选择范围，默认为<code>false</code></li>\n<li><code>joinValuse</code> 默认为 <code>true</code>，选择的 <code>value</code> 会通过 <code>delimiter</code> 连接起来，否则直接将以<code>{min: 1, max: 100}</code>的形式提交，开启<code>multiple</code>时有效</li>\n<li><code>delimiter</code> 默认为 <code>,</code></li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/Form/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"form-item\">{\n  \"type\": \"range\",\n  \"name\": \"range\",\n  \"label\": \"数字范围\",\n  \"min\": 0,\n  \"max\": 20,\n  \"step\": 2\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Range",
          "fragment": "range",
          "fullPath": "#range",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
