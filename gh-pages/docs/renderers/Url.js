define('docs/renderers/Url.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"url\" href=\"#url\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Url</h3><p>URL 输入框。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>url</code></li>\n<li><code>addOn</code> 输入框附加组件，比如附带一个提示文字，或者附带一个提交按钮。</li>\n<li><code>addOn.type</code> 请选择 <code>text</code> 、<code>button</code> 或者 <code>submit</code>。</li>\n<li><code>addOn.label</code> 文字说明</li>\n<li><code>addOn.xxx</code> 其他参数请参考按钮配置部分。</li>\n<li><code>clearable</code> 在有值的时候是否显示一个删除图标在右侧。</li>\n<li><code>resetValue</code> 默认为 <code>&quot;&quot;</code>, 删除后设置此配置项给定的值。</li>\n<li><code>options</code> 可选，选项配置，类型为数组，成员格式如下，配置后用户输入内容时会作为选项提示辅助输入。<ul>\n<li><code>label</code> 文字</li>\n<li><code>value</code> 值</li>\n</ul>\n</li>\n<li><code>source</code> 通过 options 只能配置静态数据，如果设置了 source 则会从接口拉取，实现动态效果。</li>\n<li><code>autoComplete</code> 跟 source 不同的是，每次用户输入都会去接口获取提示。</li>\n<li><code>multiple</code> 默认为 <code>false</code>, 设置成 <code>true</code> 表示可多选。</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form-item\">{\n  \"type\": \"url\",\n  \"name\": \"text\",\n  \"validateOnChange\": true,\n  \"label\": \"Url\"\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Url",
          "fragment": "url",
          "fullPath": "#url",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
