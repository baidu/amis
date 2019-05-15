define('docs/renderers/Button.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"button\" href=\"#button\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Button</h3><p>按钮, 包含 <code>button</code>、<code>submit</code> 和 <code>reset</code>。 字段说明。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>button</code></li>\n<li><code>label</code> 按钮文字</li>\n<li><code>icon</code> 按钮图标。可以使用来自 fontawesome 的图标。</li>\n<li><code>level</code> 按钮级别。 包含： <code>link</code>、<code>primary</code>、<code>success</code>、<code>info</code>、<code>warning</code>和<code>danger</code>。</li>\n<li><code>size</code> 按钮大小。 包含： <code>xs</code>、<code>sm</code>、<code>md</code>和<code>lg</code></li>\n<li><code>className</code> 按钮的类名。</li>\n</ul>\n<p>如果按钮是 <code>button</code> 类型，则还需要配置 <a href=\"#/docs/renderers/Action\">Action</a> 中定义的属性，否则，amis 不知道如何响应当前按钮点击。</p>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"form\">[\n  {\n    \"type\": \"text\",\n    \"name\": \"test\",\n    \"label\": \"Text\"\n  },\n\n  {\n    \"type\": \"button\",\n    \"label\": \"Button\",\n    \"actionType\": \"dialog\",\n    \"dialog\": {\n      \"confirmMode\": false,\n      \"title\": \"提示\",\n      \"body\": \"对，你刚点击了！\"\n    }\n  },\n\n  {\n    \"type\": \"submit\",\n    \"level\": \"primary\",\n    \"label\": \"Submit\"\n  },\n\n  {\n    \"type\": \"reset\",\n    \"label\": \"Reset\",\n    \"level\": \"danger\"\n  }\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Button",
          "fragment": "button",
          "fullPath": "#button",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
