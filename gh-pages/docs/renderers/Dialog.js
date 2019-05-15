define('docs/renderers/Dialog.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"dialog\" href=\"#dialog\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Dialog</h3><p>Dialog 由 <a href=\"#/docs/renderers/Action\">Action</a> 触发。他是一个类似于 <a href=\"#/docs/renderers/Page\">Page</a> 的容器模型。</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td><code>&quot;dialog&quot;</code> 指定为 Dialog 渲染器</td>\n</tr>\n<tr>\n<td>title</td>\n<td><code>string</code> 或者 <a href=\"#/docs/renderers/Types#Container\">Container</a></td>\n<td></td>\n<td>弹出层标题</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"#/docs/renderers/Types#Container\">Container</a></td>\n<td></td>\n<td>往 Dialog 内容区加内容</td>\n</tr>\n<tr>\n<td>size</td>\n<td><code>string</code></td>\n<td></td>\n<td>指定 dialog 大小，支持: <code>xs</code>、<code>sm</code>、<code>md</code>、<code>lg</code></td>\n</tr>\n<tr>\n<td>bodyClassName</td>\n<td><code>string</code></td>\n<td><code>modal-body</code></td>\n<td>Dialog body 区域的样式类名</td>\n</tr>\n<tr>\n<td>closeOnEsc</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否支持按 <code>Esc</code> 关闭 Dialog</td>\n</tr>\n<tr>\n<td>disabled</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>如果设置此属性，则该 Dialog 只读没有提交操作。</td>\n</tr>\n<tr>\n<td>actions</td>\n<td>Array Of <a href=\"#/docs/renderers/Action\">Action</a></td>\n<td></td>\n<td>可以不设置，默认只有【确认】和【取消】两个按钮。</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\">{\n  \"body\": {\n    \"label\": \"弹出\",\n    \"type\": \"button\",\n    \"level\": \"primary\",\n    \"actionType\": \"dialog\",\n    \"dialog\": {\n      \"title\": \"表单设置\",\n      \"body\": {\n        \"type\": \"form\",\n        \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm?waitSeconds=1\",\n        \"controls\": [\n          {\n            \"type\": \"text\",\n            \"name\": \"text\",\n            \"label\": \"文本\"\n          }\n        ]\n      }\n    }\n  }\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Dialog",
          "fragment": "dialog",
          "fullPath": "#dialog",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
