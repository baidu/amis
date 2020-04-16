define('docs/renderers/Form/Tag.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"tag\" href=\"#tag\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Tag</h3><p>标签输入框。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>tag</code></li>\n<li><code>clearable</code> 在有值的时候是否显示一个删除图标在右侧。</li>\n<li><code>resetValue</code> 默认为 <code>&quot;&quot;</code>, 删除后设置此配置项给定的值。</li>\n<li><code>optionsTip</code> 选项提示，默认为 <code>最近您使用的标签</code></li>\n<li><code>options</code> 选项配置，类型为数组，成员格式如下，或者直接为字符串，配置后用户输入内容时会作为选项提示辅助输入<ul>\n<li><code>label</code> 文字</li>\n<li><code>value</code> 值</li>\n</ul>\n</li>\n<li><code>source</code> 通过 <code>options</code> 只能配置静态数据，如果设置了 <code>source</code> 则会从接口拉取，实现动态效果。</li>\n<li><code>joinValues</code> 默认为 <code>true</code></li>\n<li>单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。</li>\n<li>多选模式：选中的多个选项的 <code>value</code> 会通过 <code>delimiter</code> 连接起来，否则直接将以数组的形式提交值。</li>\n<li><code>delimiter</code> 默认为 <code>,</code></li>\n<li><code>extractValue</code> 默认为 <code>false</code>, <code>joinValues</code>设置为<code>false</code>时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。</li>\n<li><strong>还有更多通用配置请参考</strong> <a href=\"/amis/docs/renderers/Form/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form-item\">{\n  \"type\": \"tag\",\n  \"name\": \"tag\",\n  \"label\": \"标签\"\n}\n</script></div>\n<p>带提示功能</p>\n<div class=\"amis-preview\" style=\"height: 440px\"><script type=\"text/schema\" height=\"440\" scope=\"form-item\">{\n  \"type\": \"tag\",\n  \"name\": \"tag\",\n  \"label\": \"标签\",\n  \"clearable\": true,\n  \"options\": [\n    \"wangzhaojun\",\n    \"libai\",\n    \"luna\",\n    \"zhongkui\"\n  ]\n}\n</script></div>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/Form/Tag.md\">/docs/renderers/Form/Tag.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Tag",
          "fragment": "tag",
          "fullPath": "#tag",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
