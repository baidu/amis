define('docs/renderers/Form/Input-Group.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"input-group\" href=\"#input-group\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Input-Group</h3><p>输入框组合选择器，可用于输入框与其他多个组件组合。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>input-group</code></li>\n<li><code>controls</code> 表单项集合</li>\n<li>更多配置请参考 <a href=\"/amis/docs/renderers/Form/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form\">[\n    {\n        \"type\": \"input-group\",\n        \"name\": \"input-group\",\n        \"inline\": true,\n        \"label\": \"input 组合\",\n        \"controls\": [\n            {\n                \"type\": \"text\",\n                \"placeholder\": \"搜索作业ID/名称\",\n                \"inputClassName\": \"b-r-none p-r-none\",\n                \"name\": \"input-group\"\n            },\n            {\n                \"type\": \"submit\",\n                \"label\": \"搜索\",\n                \"level\": \"primary\"\n            }\n        ]\n    },\n    {\n        \"type\": \"input-group\",\n        \"label\": \"各种组合\",\n        \"inline\": true,\n        \"controls\": [\n            {\n                \"type\": \"select\",\n                \"name\": \"memoryUnits\",\n                \"options\": [\n                    {\n                        \"label\": \"Gi\",\n                        \"value\": \"Gi\"\n                    },\n                    {\n                        \"label\": \"Mi\",\n                        \"value\": \"Mi\"\n                    },\n                    {\n                        \"label\": \"Ki\",\n                        \"value\": \"Ki\"\n                    }\n                ],\n                \"value\": \"Gi\"\n            },\n            {\n                \"type\": \"text\",\n                \"name\": \"memory\"\n            },\n            {\n                \"type\": \"select\",\n                \"name\": \"memoryUnits2\",\n                \"options\": [\n                    {\n                        \"label\": \"Gi\",\n                        \"value\": \"Gi\"\n                    },\n                    {\n                        \"label\": \"Mi\",\n                        \"value\": \"Mi\"\n                    },\n                    {\n                        \"label\": \"Ki\",\n                        \"value\": \"Ki\"\n                    }\n                ],\n                \"value\": \"Gi\"\n            },\n            {\n                \"type\": \"button\",\n                \"label\": \"Go\"\n            }\n        ]\n    }\n]\n</script></div>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/Form/Input-Group.md\">/docs/renderers/Form/Input-Group.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Input-Group",
          "fragment": "input-group",
          "fullPath": "#input-group",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
