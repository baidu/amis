define('docs/renderers/Button-Toolbar.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"button-toolbar\" href=\"#button-toolbar\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Button-Toolbar</h3><p>从上面的例子可以看出，当按钮独立配置的时候，是独占一行的，如果想让多个按钮在一起放置，可以利用 button-toolbar</p>\n<ul>\n<li><code>type</code> 请设置成 <code>button-toolbar</code></li>\n<li><code>buttons</code> 按钮集合。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form\">[\n  {\n    \"type\": \"text\",\n    \"name\": \"test\",\n    \"label\": \"Text\"\n  },\n\n  {\n    \"type\": \"button-toolbar\",\n    \"buttons\": [\n      {\n        \"type\": \"button\",\n        \"label\": \"Button\",\n        \"actionType\": \"dialog\",\n        \"dialog\": {\n          \"confirmMode\": false,\n          \"title\": \"提示\",\n          \"body\": \"对，你刚点击了！\"\n        }\n      },\n\n      {\n        \"type\": \"submit\",\n        \"label\": \"Submit\"\n      },\n\n      {\n        \"type\": \"reset\",\n        \"label\": \"Reset\"\n      }\n    ]\n  }\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Button-Toolbar",
          "fragment": "button-toolbar",
          "fullPath": "#button-toolbar",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
