amis.define('docs/zh-CN/components/form/button-toolbar.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Button-Toolbar 按钮工具栏",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Button-Toolbar",
    "icon": null,
    "order": 5,
    "html": "<div class=\"markdown-body\"><p>默认按钮会独占一行，如果想让多个按钮并排方式，可以使用 <code>button-toolbar</code> 组件包裹起来，另外还有能用 <a href=\"./button-group\">button-group</a> 来在展现上更紧凑。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"body\": [\n        {\n            \"type\": \"input-text\",\n            \"name\": \"test\",\n            \"label\": \"Text\"\n        },\n\n        {\n            \"type\": \"button-toolbar\",\n            \"label\": \"按钮组\",\n            \"buttons\": [\n                {\n                    \"type\": \"button\",\n                    \"label\": \"按钮\",\n                    \"actionType\": \"dialog\",\n                    \"dialog\": {\n                        \"title\": \"提示\",\n                        \"body\": \"对，你刚点击了！\"\n                    }\n                },\n\n                {\n                    \"type\": \"submit\",\n                    \"label\": \"提交\"\n                },\n\n                {\n                    \"type\": \"reset\",\n                    \"label\": \"重置\"\n                }\n            ]\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;button-toolbar&quot;</code></td>\n<td>指定为 ButtonToolbar 组件</td>\n</tr>\n<tr>\n<td>buttons</td>\n<td>Array&lt;<a href=\"./action\">行为按钮</a>&gt;</td>\n<td></td>\n<td>按钮组</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本使用",
          "fragment": "%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "level": 2
        },
        {
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
