define('docs/renderers/ButtonGroup.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"buttongroup\" href=\"#buttongroup\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ButtonGroup</h2><p>按钮集合。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>button-group</code></li>\n<li><code>buttons</code> 配置按钮集合。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"body\">{\n  \"type\": \"button-toolbar\",\n  \"buttons\": [\n    {\n      \"type\": \"button-group\",\n      \"buttons\": [\n        {\n          \"type\": \"button\",\n          \"label\": \"Button\",\n          \"actionType\": \"dialog\",\n          \"dialog\": {\n            \"confirmMode\": false,\n            \"title\": \"提示\",\n            \"body\": \"对，你刚点击了！\"\n          }\n        },\n\n        {\n          \"type\": \"submit\",\n          \"label\": \"Submit\"\n        },\n\n        {\n          \"type\": \"reset\",\n          \"label\": \"Reset\"\n        }\n      ]\n    },\n\n    {\n      \"type\": \"submit\",\n      \"icon\": \"fa fa-check text-success\"\n    },\n\n    {\n      \"type\": \"reset\",\n      \"icon\": \"fa fa-times text-danger\"\n    }\n  ]\n}\n</script></div>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/ButtonGroup.md\">/docs/renderers/ButtonGroup.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "ButtonGroup",
          "fragment": "buttongroup",
          "fullPath": "#buttongroup",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
