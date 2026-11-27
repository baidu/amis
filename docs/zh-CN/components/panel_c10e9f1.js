amis.define('docs/zh-CN/components/panel.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Panel 面板",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Panel",
    "icon": null,
    "order": 59,
    "html": "<div class=\"markdown-body\"><p>可以把相关信息以面板的形式展示到一块。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"panel\",\n    \"title\": \"面板标题\",\n    \"body\": \"面板内容\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%BA%95%E9%83%A8%E9%85%8D%E7%BD%AE%E6%8C%89%E9%92%AE\" href=\"#%E5%BA%95%E9%83%A8%E9%85%8D%E7%BD%AE%E6%8C%89%E9%92%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>底部配置按钮</h2><p>可以通过配置<code>actions</code>数组，实现渲染底部按钮栏</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"panel\",\n  \"title\": \"面板标题\",\n  \"body\": \"面板内容\",\n  \"actions\": [\n    {\n      \"type\": \"button\",\n      \"label\": \"按钮 1\",\n      \"actionType\": \"dialog\",\n      \"dialog\": {\n        \"title\": \"提示\",\n        \"body\": \"对，你刚点击了！\"\n      }\n    },\n\n    {\n      \"type\": \"button\",\n      \"label\": \"按钮 2\",\n      \"actionType\": \"dialog\",\n      \"dialog\": {\n        \"title\": \"提示\",\n        \"body\": \"对，你刚点击了！\"\n      }\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%9B%BA%E5%AE%9A%E5%BA%95%E9%83%A8\" href=\"#%E5%9B%BA%E5%AE%9A%E5%BA%95%E9%83%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>固定底部</h2><p>有时 panel 内，内容过多，导致底部操作按钮不是很方便，可以配置<code>&quot;affixFooter&quot;: true</code>，将底部部分贴在浏览器底部展示。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"panel\",\n  \"title\": \"面板标题\",\n  \"body\": \"面板内容\",\n  \"affixFooter\": true,\n  \"actions\": [\n    {\n      \"type\": \"button\",\n      \"label\": \"按钮 1\",\n      \"actionType\": \"dialog\",\n      \"dialog\": {\n        \"title\": \"提示\",\n        \"body\": \"对，你刚点击了！\"\n      }\n    },\n\n    {\n      \"type\": \"button\",\n      \"label\": \"按钮 2\",\n      \"actionType\": \"dialog\",\n      \"dialog\": {\n        \"title\": \"提示\",\n        \"body\": \"对，你刚点击了！\"\n      }\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;panel&quot;</code></td>\n<td>指定为 Panel 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-default&quot;</code></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>headerClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-heading&quot;</code></td>\n<td>header 区域的类名</td>\n</tr>\n<tr>\n<td>footerClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-footer bg-light lter wrapper&quot;</code></td>\n<td>footer 区域的类名</td>\n</tr>\n<tr>\n<td>actionsClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-footer&quot;</code></td>\n<td>actions 区域的类名</td>\n</tr>\n<tr>\n<td>bodyClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-body&quot;</code></td>\n<td>body 区域的类名</td>\n</tr>\n<tr>\n<td>title</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>header</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>头部容器</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>内容容器</td>\n</tr>\n<tr>\n<td>footer</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>底部容器</td>\n</tr>\n<tr>\n<td>affixFooter</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否固定底部容器</td>\n</tr>\n<tr>\n<td>actions</td>\n<td>Array&lt;<a href=\"./action\">Action</a>&gt;</td>\n<td></td>\n<td>按钮区域</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本用法",
          "fragment": "%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "level": 2
        },
        {
          "label": "底部配置按钮",
          "fragment": "%E5%BA%95%E9%83%A8%E9%85%8D%E7%BD%AE%E6%8C%89%E9%92%AE",
          "fullPath": "#%E5%BA%95%E9%83%A8%E9%85%8D%E7%BD%AE%E6%8C%89%E9%92%AE",
          "level": 2
        },
        {
          "label": "固定底部",
          "fragment": "%E5%9B%BA%E5%AE%9A%E5%BA%95%E9%83%A8",
          "fullPath": "#%E5%9B%BA%E5%AE%9A%E5%BA%95%E9%83%A8",
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
