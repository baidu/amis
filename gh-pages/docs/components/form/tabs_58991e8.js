amis.define('docs/components/form/tabs.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Tabs 选项卡",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Tabs 选项卡",
    "icon": null,
    "order": 53,
    "html": "<p>有多组输入框时，也可以通过选项卡来分组。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"controls\": [\n        {\n  \"type\": \"tabs\",\n  \"tabs\": [\n    {\n      \"title\": \"基本配置\",\n      \"controls\": [\n        {\n          \"name\": \"text1\",\n          \"type\": \"text\",\n          \"label\": \"文本1\"\n        },\n\n        {\n          \"name\": \"text2\",\n          \"type\": \"text\",\n          \"label\": \"文本2\"\n        }\n      ]\n    },\n\n    {\n      \"title\": \"其他配置\",\n      \"controls\": [\n        {\n          \"name\": \"text3\",\n          \"type\": \"text\",\n          \"label\": \"文本3\"\n        },\n\n        {\n          \"name\": \"text4\",\n          \"type\": \"text\",\n          \"label\": \"文本4\"\n        }\n      ]\n    }\n  ]\n}\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>tabs</td>\n<td><code>Array</code></td>\n<td></td>\n<td>tabs 内容</td>\n</tr>\n<tr>\n<td>toolbar</td>\n<td><a href=\"../../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>tabs 中的工具栏</td>\n</tr>\n<tr>\n<td>toolbarClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>tabs 中工具栏的类名</td>\n</tr>\n<tr>\n<td>tabs[x].title</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tab 标题</td>\n</tr>\n<tr>\n<td>tabs[x].body</td>\n<td><a href=\"../../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>内容容器</td>\n</tr>\n<tr>\n<td>tabs[x].controls</td>\n<td>Array&lt;<a href=\"./formitem\">表单项</a>&gt;</td>\n<td></td>\n<td>表单项集合。</td>\n</tr>\n</tbody>\n</table>\n",
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
