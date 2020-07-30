amis.define('docs/components/form/grid.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Grid 网格",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Grid",
    "icon": null,
    "order": 23,
    "html": "<p>支持 Form 内部再用 grid 布局进行渲染组件。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"grid\",\n            \"columns\": [\n                {\n                    \"md\": 3,\n                    \"controls\": [\n                        {\n                            \"name\": \"text\",\n                            \"type\": \"text\",\n                            \"label\": \"text\"\n                        }\n                    ]\n                },\n\n                {\n                    \"md\": 9,\n                    \"controls\": [\n                        {\n                            \"name\": \"editor\",\n                            \"type\": \"editor\",\n                            \"label\": \"editor\"\n                        }\n                    ]\n                }\n            ]\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;grid&quot;</code></td>\n<td>指定为 Grid 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>columns</td>\n<td><code>Array</code></td>\n<td></td>\n<td>列集合</td>\n</tr>\n<tr>\n<td>columns[x]</td>\n<td><a href=\"../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>成员可以是其他渲染器</td>\n</tr>\n<tr>\n<td>columns[x].controls</td>\n<td>Array&lt;<a href=\"./formitem\">表单项</a>&gt;</td>\n<td></td>\n<td>如果配置了表单集合，同时没有指定 type 类型，则优先展示表单集合</td>\n</tr>\n<tr>\n<td>columns[x].columnClassName</td>\n<td><code>int</code></td>\n<td></td>\n<td>配置列的 <code>className</code></td>\n</tr>\n<tr>\n<td>columns[x].xs</td>\n<td><code>int</code></td>\n<td></td>\n<td>宽度占比： 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].xsHidden</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否隐藏</td>\n</tr>\n<tr>\n<td>columns[x].xsOffset</td>\n<td><code>int</code></td>\n<td></td>\n<td>偏移量 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].xsPull</td>\n<td><code>int</code></td>\n<td></td>\n<td>靠左的距离占比：1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].xsPush</td>\n<td><code>int</code></td>\n<td></td>\n<td>靠右的距离占比： 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].sm</td>\n<td><code>int</code></td>\n<td></td>\n<td>宽度占比： 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].smHidden</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否隐藏</td>\n</tr>\n<tr>\n<td>columns[x].smOffset</td>\n<td><code>int</code></td>\n<td></td>\n<td>偏移量 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].smPull</td>\n<td><code>int</code></td>\n<td></td>\n<td>靠左的距离占比：1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].smPush</td>\n<td><code>int</code></td>\n<td></td>\n<td>靠右的距离占比： 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].md</td>\n<td><code>int</code></td>\n<td></td>\n<td>宽度占比： 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].mdHidden</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否隐藏</td>\n</tr>\n<tr>\n<td>columns[x].mdOffset</td>\n<td><code>int</code></td>\n<td></td>\n<td>偏移量 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].mdPull</td>\n<td><code>int</code></td>\n<td></td>\n<td>靠左的距离占比：1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].mdPush</td>\n<td><code>int</code></td>\n<td></td>\n<td>靠右的距离占比： 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].lg</td>\n<td><code>int</code></td>\n<td></td>\n<td>宽度占比： 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].lgHidden</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否隐藏</td>\n</tr>\n<tr>\n<td>columns[x].lgOffset</td>\n<td><code>int</code></td>\n<td></td>\n<td>偏移量 1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].lgPull</td>\n<td><code>int</code></td>\n<td></td>\n<td>靠左的距离占比：1 - 12</td>\n</tr>\n<tr>\n<td>columns[x].lgPush</td>\n<td><code>int</code></td>\n<td></td>\n<td>靠右的距离占比： 1 - 12</td>\n</tr>\n</tbody>\n</table>\n<p>更多使用说明，请参看 <a href=\"https://react-bootstrap.github.io/layout/grid/#col-props\">Grid Props</a></p>\n",
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
