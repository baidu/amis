amis.define('docs/zh-CN/types/classname.md', function(require, exports, module, define) {

  module.exports = {
    "title": "ClassName",
    "description": null,
    "type": 0,
    "menuName": "ClassName",
    "icon": null,
    "order": 40,
    "html": "<div class=\"markdown-body\"><p>amis 中大部分的组件都支持配置 className 和 xxxClassName，他可以用来配置组件 dom 上的 css 类名，可以结合帮助类 css 来定制一些样式。具体帮助类 css 请前往<a href=\"../../style/index#辅助-class\">这里</a>。</p>\n<p>配置方式有两种：</p>\n<ol>\n<li>直接配置字符串如：<code>className: &quot;text-danger&quot;</code> 文字标红。</li>\n<li>采用对象配置，这个用法主要是方便写表达式如：<code>className: {&quot;text-danger&quot;: &quot;this.status == 1&quot;}</code> 表示当数据 status 状态是 1 时，文字飘红。</li>\n</ol>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n\n    \"type\": \"page\",\n    \"title\": \"引用\",\n    \"body\": [\n        {\n            \"type\": \"form\",\n            \"actions\": [],\n            \"debug\": true,\n            \"mode\": \"horizontal\",\n            \"body\": [\n                {\n                    \"type\": \"radios\",\n                    \"name\": \"status\",\n                    \"value\": \"1\",\n                    \"label\": \"状态\",\n                    \"options\": {\n                        \"1\": \"离线\",\n                        \"2\": \"在线\"\n                    }\n                },\n\n                {\n                    \"type\": \"mapping\",\n                    \"name\": \"status\",\n                    \"label\": \"状态展示\",\n                    \"map\": {\n                        \"1\": \"离线\",\n                        \"2\": \"在线\"\n                    },\n                    \"inputClassName\": {\n                        \"text-muted\": \"this.status == 1\",\n                        \"text-success\": \"this.status == 2\"\n                    }\n                }\n            ]\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [],
      "level": 0
    }
  };

});
