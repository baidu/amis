amis.define('docs/components/form/panel.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Panel 面板",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Panel",
    "icon": null,
    "order": 34,
    "html": "<p>还是为了布局，可以把一部分 <a href=\"./formItem\">FormItem</a> 合并到一个 panel 里面单独展示。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n          \"type\": \"panel\",\n          \"controls\": [\n            {\n              \"name\": \"text\",\n              \"type\": \"text\",\n              \"label\": \"text\"\n            },\n\n            {\n              \"name\": \"text2\",\n              \"type\": \"text\",\n              \"label\": \"text2\"\n            }\n          ]\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>title</td>\n<td><code>string</code></td>\n<td></td>\n<td>panel 标题</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"../../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>内容区</td>\n</tr>\n<tr>\n<td>bodyClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>body 的 className</td>\n</tr>\n<tr>\n<td>footer</td>\n<td><a href=\"../../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>底部区</td>\n</tr>\n<tr>\n<td>footerClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>footer 的 className</td>\n</tr>\n<tr>\n<td>controls</td>\n<td>Array&lt;表单项&gt;</td>\n<td></td>\n<td><code>controls</code> 跟 <code>body</code> 二选一，如果设置了 controls 优先显示表单集合。</td>\n</tr>\n</tbody>\n</table>\n<ul>\n<li><code>title</code> panel 标题</li>\n<li><code>body</code> <a href=\"../../types/schemanode\">SchemaNode</a> 可以是其他渲染模型。</li>\n<li><code>bodyClassName</code> body 的 className.</li>\n<li><code>footer</code> <a href=\"../../types/schemanode\">SchemaNode</a> 可以是其他渲染模型。</li>\n<li><code>footerClassName</code> footer 的 className.</li>\n<li><code>controls</code> 跟 <code>body</code> 二选一，如果设置了 controls 优先显示表单集合。</li>\n</ul>\n",
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
