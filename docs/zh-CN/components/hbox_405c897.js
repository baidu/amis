amis.define('docs/zh-CN/components/hbox.md', function(require, exports, module, define) {

  module.exports = {
    "title": "HBox 布局",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "HBox",
    "icon": null,
    "order": 48,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n    {\n        \"type\": \"hbox\",\n        \"className\": \"b-a bg-dark lter\",\n        \"columns\": [\n            {\n                \"type\": \"plain\",\n                \"text\": \"Col A\",\n                \"columnClassName\": \"wrapper-xs b-r\"\n            },\n\n            \"Col B\"\n        ]\n    },\n\n    {\n        \"type\": \"hbox\",\n        \"className\": \"b-a m-t bg-dark lter\",\n        \"columns\": [\n            {\n                \"type\": \"plain\",\n                \"text\": \"w-md\",\n                \"columnClassName\": \"w-md wrapper-xs bg-primary b-r\"\n            },\n            \"...\"\n        ]\n    }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;hbox&quot;</code></td>\n<td>指定为 HBox 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>gap</td>\n<td><code>&#39;xs&#39; | &#39;sm&#39; | &#39;base&#39; | &#39;none&#39; | &#39;md&#39; | &#39;lg&#39;</code></td>\n<td></td>\n<td>水平间距</td>\n</tr>\n<tr>\n<td>valign</td>\n<td><code>&#39;top&#39; | &#39;middle&#39; | &#39;bottom&#39; | &#39;between&#39;</code></td>\n<td></td>\n<td>垂直对齐方式</td>\n</tr>\n<tr>\n<td>align</td>\n<td><code>&#39;left&#39; | &#39;right&#39; | &#39;between&#39; | &#39;center&#39;</code></td>\n<td></td>\n<td>水平对齐方式</td>\n</tr>\n<tr>\n<td>columns</td>\n<td><code>Array</code></td>\n<td></td>\n<td>列集合</td>\n</tr>\n<tr>\n<td>columns[x]</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>成员可以是其他渲染器</td>\n</tr>\n<tr>\n<td>columns[x].columnClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;wrapper-xs&quot;</code></td>\n<td>列上类名</td>\n</tr>\n<tr>\n<td>columns[x].valign</td>\n<td><code>&#39;top&#39; | &#39;middle&#39; | &#39;bottom&#39; | &#39;between&#39;</code></td>\n<td></td>\n<td>当前列内容的垂直对齐</td>\n</tr>\n</tbody></table>\n</div>",
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
