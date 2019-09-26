define('docs/renderers/Form/Checkboxes.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"checkboxes\" href=\"#checkboxes\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Checkboxes</h3><p>复选框</p>\n<ul>\n<li><code>type</code> 请设置成 <code>checkboxes</code></li>\n<li><code>options</code> 选项配置，类型为数组，成员格式如下。<ul>\n<li><code>label</code> 文字</li>\n<li><code>value</code> 值</li>\n</ul>\n</li>\n<li><code>source</code> Api 地址，如果选项不固定，可以通过配置 <code>source</code> 动态拉取。</li>\n<li><code>joinValues</code> 默认为 <code>true</code> 选中的多个选项的 <code>value</code> 会通过 <code>delimiter</code> 连接起来，否则直接将以数组的形式提交值。</li>\n<li><code>extractValue</code> 默认为 <code>false</code>, <code>joinValues</code>设置为<code>false</code>时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。</li>\n<li><code>delimiter</code> 默认为 <code>,</code></li>\n<li><code>columnsCount</code> 默认为 <code>1</code> 可以配置成一行显示多个。</li>\n<li><code>checkAll</code> 默认为 <code>false</code> 开启后支持全选</li>\n<li><code>defaultCheckAll</code> 是否默认全选，默认为<code>false</code></li>\n<li><strong>还有更多通用配置请参考</strong> <a href=\"/amis/docs/renderers/Form/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 530px\"><script type=\"text/schema\" height=\"530\" scope=\"form\">[\n    {\n      \"name\": \"checkboxes\",\n      \"type\": \"checkboxes\",\n      \"label\": \"Checkboxes\",\n      \"options\": [\n          {\n            \"label\": \"OptionA\",\n            \"value\": \"a\"\n          },\n          {\n            \"label\": \"OptionB\",\n            \"value\": \"b\"\n          },\n          {\n            \"label\": \"OptionC\",\n            \"value\": \"c\"\n          },\n          {\n            \"label\": \"OptionD\",\n            \"value\": \"d\"\n          }\n        ]\n    },\n\n    {\n        \"type\": \"static\",\n        \"name\": \"checkboxes\",\n        \"label\": \"当前值\"\n    }\n]\n</script></div>\n<h3><a class=\"anchor\" name=\"%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E\" href=\"#%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>接口说明</h3><p>开始之前请你先阅读<a href=\"/amis/docs/renderers/api\">整体要求</a>。</p>\n<h4><a class=\"anchor\" name=\"source\" href=\"#source\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>source</h4><p><strong>发送</strong></p>\n<p>默认 GET，不携带数据，可从上下文中取数据设置进去。</p>\n<p><strong>响应</strong></p>\n<p>格式要求如下：</p>\n<pre><code class=\"lang-json\">{\n  <span class=\"hljs-attr\">\"status\"</span>: <span class=\"hljs-number\">0</span>,\n  <span class=\"hljs-attr\">\"msg\"</span>: <span class=\"hljs-string\">\"\"</span>,\n  <span class=\"hljs-attr\">\"data\"</span>: {\n    <span class=\"hljs-attr\">\"options\"</span>: [\n      {\n        <span class=\"hljs-attr\">\"label\"</span>: <span class=\"hljs-string\">\"描述\"</span>,\n        <span class=\"hljs-attr\">\"value\"</span>: <span class=\"hljs-string\">\"值\"</span>\n      },\n\n      {\n        <span class=\"hljs-attr\">\"label\"</span>: <span class=\"hljs-string\">\"描述2\"</span>,\n        <span class=\"hljs-attr\">\"value\"</span>: <span class=\"hljs-string\">\"值2\"</span>\n      }\n    ],\n\n    <span class=\"hljs-attr\">\"value\"</span>: <span class=\"hljs-string\">\"值\"</span> // 默认值，可以获取列表的同时设置默认值。\n  }\n}\n</code></pre>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/Form/Checkboxes.md\">/docs/renderers/Form/Checkboxes.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Checkboxes",
          "fragment": "checkboxes",
          "fullPath": "#checkboxes",
          "level": 3
        },
        {
          "label": "接口说明",
          "fragment": "%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E",
          "fullPath": "#%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E",
          "level": 3,
          "children": [
            {
              "label": "source",
              "fragment": "source",
              "fullPath": "#source",
              "level": 4
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
