define('docs/renderers/FormItem-Button-Group.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"button-group-formitem-\" href=\"#button-group-formitem-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Button-Group(FormItem)</h3><p>按钮集合，直接看示例吧。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>button-group</code></li>\n<li><code>buttons</code> 配置按钮集合。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form\">[\n  {\n    \"type\": \"text\",\n    \"name\": \"test\",\n    \"label\": \"Text\"\n  },\n\n  {\n    \"type\": \"button-toolbar\",\n    \"buttons\": [\n      {\n        \"type\": \"button-group\",\n        \"buttons\": [\n          {\n            \"type\": \"button\",\n            \"label\": \"Button\",\n            \"actionType\": \"dialog\",\n            \"dialog\": {\n              \"confirmMode\": false,\n              \"title\": \"提示\",\n              \"body\": \"对，你刚点击了！\"\n            }\n          },\n\n          {\n            \"type\": \"submit\",\n            \"label\": \"Submit\"\n          },\n\n          {\n            \"type\": \"reset\",\n            \"label\": \"Reset\"\n          }\n        ]\n      },\n\n      {\n        \"type\": \"submit\",\n        \"icon\": \"fa fa-check text-success\"\n      },\n\n      {\n        \"type\": \"reset\",\n        \"icon\": \"fa fa-times text-danger\"\n      }\n    ]\n  }\n]\n</script></div>\n<p>button-group 有两种模式，除了能让按钮组合在一起，还能做类似于单选功能。</p>\n<p>当不配置 buttons 属性时，就可以当复选框用。</p>\n<ul>\n<li><code>options</code> 选项配置，类型为数组，成员格式如下。<ul>\n<li><code>label</code> 文字</li>\n<li><code>value</code> 值</li>\n<li><code>image</code> 图片的 http 地址。</li>\n</ul>\n</li>\n<li><code>source</code> Api 地址，如果选项不固定，可以通过配置 <code>source</code> 动态拉取。</li>\n<li><code>multiple</code> 默认为 <code>false</code>, 设置成 <code>true</code> 表示可多选。</li>\n<li><code>joinValues</code> 默认为 <code>true</code></li>\n<li>单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。</li>\n<li>多选模式：选中的多个选项的 <code>value</code> 会通过 <code>delimiter</code> 连接起来，否则直接将以数组的形式提交值。</li>\n<li><code>delimiter</code> 默认为 <code>,</code></li>\n<li><code>clearable</code> 默认为 <code>true</code>, 表示可以取消选中。</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form\">[\n    {\n      \"type\": \"button-group\",\n      \"name\": \"select\",\n      \"label\": \"单选\",\n      \"options\": [\n        {\n          \"label\": \"Option A\",\n          \"value\": \"a\"\n        },\n        {\n          \"label\": \"Option B\",\n          \"value\": \"b\"\n        }\n      ]\n    },\n\n    {\n      \"type\": \"static\",\n      \"name\": \"select\",\n      \"label\": \"当前值\"\n    }\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Button-Group(FormItem)",
          "fragment": "button-group-formitem-",
          "fullPath": "#button-group-formitem-",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
