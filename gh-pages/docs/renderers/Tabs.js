define('docs/renderers/Tabs.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"tabs\" href=\"#tabs\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Tabs</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;tabs&quot;</code></td>\n<td>指定为 Tabs 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>tabsClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tabs Dom 的类名</td>\n</tr>\n<tr>\n<td>tabs</td>\n<td><code>Array</code></td>\n<td></td>\n<td>tabs 内容</td>\n</tr>\n<tr>\n<td>tabs[x].title</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tab 标题</td>\n</tr>\n<tr>\n<td>tabs[x].icon</td>\n<td><code>icon</code></td>\n<td></td>\n<td>Tab 的图标</td>\n</tr>\n<tr>\n<td>tabs[x].tab</td>\n<td><a href=\"#container\">Container</a></td>\n<td></td>\n<td>内容区</td>\n</tr>\n<tr>\n<td>tabs[x].hash</td>\n<td><code>string</code></td>\n<td></td>\n<td>设置以后将跟 url 的 hash 对应</td>\n</tr>\n<tr>\n<td>tabs[x].reload</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用</td>\n</tr>\n<tr>\n<td>tabs[x].className</td>\n<td><code>string</code></td>\n<td><code>&quot;bg-white b-l b-r b-b wrapper-md&quot;</code></td>\n<td>Tab 区域样式</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"tabs\",\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Tabs",
          "fragment": "tabs",
          "fullPath": "#tabs",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
