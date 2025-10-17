amis.define('docs/zh-CN/components/pagination-wrapper.md', function(require, exports, module, define) {

  module.exports = {
    "title": "PaginationWrapper 分页容器",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "PaginationWrapper",
    "icon": null,
    "order": 59,
    "html": "<div class=\"markdown-body\"><p>分页容器组件，可以用来对已有列表数据做分页处理。</p>\n<ul>\n<li>输入：默认读取作用域中的 items 变量，如果是其他变量名请配置 <code>inputName</code>。</li>\n<li>输出：经过分页处理后会把分页后的数据下发给 <code>outputName</code> （默认也是 items）对应的数据。</li>\n</ul>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"service\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/crud/table\",\n    \"body\": [\n        {\n            \"type\": \"pagination-wrapper\",\n            \"inputName\": \"rows\",\n            \"outputName\": \"rows\",\n            \"perPage\": 2,\n            \"body\": [\n                {\n                    \"type\": \"table\",\n                    \"title\": \"分页表格\",\n                    \"source\": \"${rows}\",\n                    \"columns\": [\n                        {\n                            \"name\": \"engine\",\n                            \"label\": \"Engine\"\n                        },\n                        {\n                            \"name\": \"version\",\n                            \"label\": \"Version\"\n                        }\n                    ]\n                }\n            ]\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;pagination-wrapper&quot;</code></td>\n<td>指定为 Pagination-Wrapper 渲染器</td>\n</tr>\n<tr>\n<td>showPageInput</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否显示快速跳转输入框</td>\n</tr>\n<tr>\n<td>maxButtons</td>\n<td><code>number</code></td>\n<td><code>5</code></td>\n<td>最多显示多少个分页按钮</td>\n</tr>\n<tr>\n<td>inputName</td>\n<td><code>string</code></td>\n<td><code>&quot;items&quot;</code></td>\n<td>输入字段名</td>\n</tr>\n<tr>\n<td>outputName</td>\n<td><code>string</code></td>\n<td><code>&quot;items&quot;</code></td>\n<td>输出字段名</td>\n</tr>\n<tr>\n<td>perPage</td>\n<td><code>number</code></td>\n<td><code>10</code></td>\n<td>每页显示多条数据</td>\n</tr>\n<tr>\n<td>position</td>\n<td><code>&#39;top&#39;</code> 或 <code>&#39;bottom&#39;</code> 或 <code>&#39;none&#39;</code></td>\n<td><code>&quot;top&quot;</code></td>\n<td>分页显示位置，如果配置为 none 则需要自己在内容区域配置 pagination 组件，否则不显示</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>内容区域</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
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
