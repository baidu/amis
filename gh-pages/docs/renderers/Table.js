define('docs/renderers/Table.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"table\" href=\"#table\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Table</h3><p>表格展示。</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td><code>&quot;table&quot;</code> 指定为 table 渲染器</td>\n</tr>\n<tr>\n<td>title</td>\n<td><code>string</code></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code></td>\n<td><code>${items}</code></td>\n<td>数据源, 绑定当前环境变量</td>\n</tr>\n<tr>\n<td>affixHeader</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否固定表头</td>\n</tr>\n<tr>\n<td>columnsTogglable</td>\n<td><code>auto</code> 或者 <code>boolean</code></td>\n<td><code>auto</code></td>\n<td>展示列显示开关, 自动即：列数量大于或等于 5 个时自动开启</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td>string</td>\n<td>‘暂无数据’</td>\n<td>当没数据的时候的文字提示</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td><code>panel-default</code></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>tableClassName</td>\n<td><code>string</code></td>\n<td><code>table-db table-striped</code></td>\n<td>表格 CSS 类名</td>\n</tr>\n<tr>\n<td>headerClassName</td>\n<td><code>string</code></td>\n<td><code>Action.md-table-header</code></td>\n<td>顶部外层 CSS 类名</td>\n</tr>\n<tr>\n<td>footerClassName</td>\n<td><code>string</code></td>\n<td><code>Action.md-table-footer</code></td>\n<td>底部外层 CSS 类名</td>\n</tr>\n<tr>\n<td>toolbarClassName</td>\n<td><code>string</code></td>\n<td><code>Action.md-table-toolbar</code></td>\n<td>工具栏 CSS 类名</td>\n</tr>\n<tr>\n<td>columns</td>\n<td>Array of <a href=\"#/docs/renderers/.Column\">Column</a></td>\n<td></td>\n<td>用来设置列信息</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 900px\"><script type=\"text/schema\" height=\"900\" scope=\"body\">{\n    \"type\": \"service\",\n    \"api\": \"https://houtai.baidu.com/api/sample?perPage=5\",\n    \"body\": [\n        {\n            \"type\": \"panel\",\n            \"title\": \"简单表格示例1\",\n            \"body\": {\n                \"type\": \"table\",\n                \"source\": \"$rows\",\n                \"columns\": [\n                    {\n                        \"name\": \"engine\",\n                        \"label\": \"Engine\"\n                    },\n\n                    {\n                        \"name\": \"version\",\n                        \"label\": \"Version\"\n                    }\n                ]\n            }\n        },\n\n        {\n            \"type\": \"panel\",\n            \"title\": \"简单表格示例2\",\n            \"body\": {\n                \"type\": \"table\",\n                \"source\": \"$rows\",\n                \"columns\": [\n                    {\n                        \"name\": \"engine\",\n                        \"label\": \"Engine\"\n                    },\n\n                    {\n                        \"name\": \"version\",\n                        \"label\": \"Version\"\n                    }\n                ]\n            }\n        }\n    ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Table",
          "fragment": "table",
          "fullPath": "#table",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
