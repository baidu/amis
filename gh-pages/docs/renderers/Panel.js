define('docs/renderers/Panel.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"panel\" href=\"#panel\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Panel</h3><p>可以把相关信息以盒子的形式展示到一块。</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;panel&quot;</code></td>\n<td>指定为 Panel 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-default&quot;</code></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>headerClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-heading&quot;</code></td>\n<td>header 区域的类名</td>\n</tr>\n<tr>\n<td>footerClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-footer bg-light lter wrapper&quot;</code></td>\n<td>footer 区域的类名</td>\n</tr>\n<tr>\n<td>actionsClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-footer&quot;</code></td>\n<td>actions 区域的类名</td>\n</tr>\n<tr>\n<td>bodyClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-body&quot;</code></td>\n<td>body 区域的类名</td>\n</tr>\n<tr>\n<td>title</td>\n<td><code>string</code></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>header</td>\n<td><a href=\"#/docs/renderers/Types#container\">Container</a></td>\n<td></td>\n<td>顶部容器</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"#/docs/renderers/Types#container\">Container</a></td>\n<td></td>\n<td>内容容器</td>\n</tr>\n<tr>\n<td>footer</td>\n<td><a href=\"#/docs/renderers/Types#container\">Container</a></td>\n<td></td>\n<td>底部容器</td>\n</tr>\n<tr>\n<td>affixFooter</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否固定底部容器</td>\n</tr>\n<tr>\n<td>actions</td>\n<td>Array Of <a href=\"#/docs/renderers/Button\">Button</a></td>\n<td></td>\n<td>按钮区域</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"panel\",\n    \"title\": \"Panel Heading\",\n    \"body\": \"Panel Body\",\n    \"actions\": [\n        {\n            \"type\": \"button\",\n            \"label\": \"Action 1\",\n            \"actionType\": \"dialog\",\n            \"dialog\": {\n              \"confirmMode\": false,\n              \"title\": \"提示\",\n              \"body\": \"对，你刚点击了！\"\n            }\n        },\n\n        {\n          \"type\": \"button\",\n          \"label\": \"Action 2\",\n          \"actionType\": \"dialog\",\n          \"dialog\": {\n            \"confirmMode\": false,\n            \"title\": \"提示\",\n            \"body\": \"对，你刚点击了！\"\n          }\n        }\n    ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Panel",
          "fragment": "panel",
          "fullPath": "#panel",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
