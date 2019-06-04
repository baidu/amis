define('docs/renderers/Nav.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"nav\" href=\"#nav\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Nav</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;tabs&quot;</code></td>\n<td>指定为 Nav 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>stacked</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>设置成 false 可以以 tabs 的形式展示</td>\n</tr>\n<tr>\n<td>links</td>\n<td><code>Array</code></td>\n<td></td>\n<td>链接集合</td>\n</tr>\n<tr>\n<td>links[x].label</td>\n<td><code>string</code></td>\n<td></td>\n<td>名称</td>\n</tr>\n<tr>\n<td>links[x].to</td>\n<td><code>string</code></td>\n<td></td>\n<td>链接地址</td>\n</tr>\n<tr>\n<td>links[x].icon</td>\n<td><code>string</code></td>\n<td></td>\n<td>图标</td>\n</tr>\n<tr>\n<td>links[x].active</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否高亮</td>\n</tr>\n<tr>\n<td>links[x].activeOn</td>\n<td><code>表达式</code></td>\n<td></td>\n<td>是否高亮的条件，留空将自动分析链接地址</td>\n</tr>\n</tbody>\n</table>\n<p>链接集合。</p>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"nav\",\n    \"stacked\": true,\n    \"className\": \"w-md\",\n    \"links\": [\n        {\n            \"label\": \"Nav 1\",\n            \"to\": \"/docs/index\",\n            \"icon\": \"fa fa-user\",\n            \"active\": true\n        },\n\n        {\n            \"label\": \"Nav 2\",\n            \"to\": \"/docs/api\"\n        },\n\n        {\n            \"label\": \"Nav 3\",\n            \"to\": \"/docs/renderers\"\n        }\n    ]\n}\n</script></div>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"nav\",\n    \"stacked\": false,\n    \"links\": [\n        {\n            \"label\": \"Nav 1\",\n            \"to\": \"/docs/index\",\n            \"icon\": \"fa fa-user\"\n        },\n\n        {\n            \"label\": \"Nav 2\",\n            \"to\": \"/docs/api\"\n        },\n\n        {\n            \"label\": \"Nav 3\",\n            \"to\": \"/docs/renderers\"\n        }\n    ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Nav",
          "fragment": "nav",
          "fullPath": "#nav",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
