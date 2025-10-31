amis.define('docs/zh-CN/components/divider.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Divider 分割线",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Divider 分割线",
    "icon": null,
    "order": 42,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"divider\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%B8%8D%E5%90%8C%E6%A0%B7%E5%BC%8F\" href=\"#%E4%B8%8D%E5%90%8C%E6%A0%B7%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>不同样式</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n    {\n        \"type\": \"divider\",\n        \"lineStyle\": \"solid\"\n    },\n    {\n        \"type\": \"divider\",\n        \"lineStyle\": \"dashed\"\n    }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B8%A6%E6%A0%87%E9%A2%98%E7%9A%84%E5%88%86%E5%89%B2%E7%BA%BF\" href=\"#%E5%B8%A6%E6%A0%87%E9%A2%98%E7%9A%84%E5%88%86%E5%89%B2%E7%BA%BF\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>带标题的分割线</h2><blockquote>\n<p><code>3.5.0</code>及以上版本</p>\n</blockquote>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n    {\n        \"type\": \"divider\",\n        \"title\": \"Text\",\n        \"titlePosition\": \"left\"\n    },\n    {\n        \"type\": \"divider\",\n        \"title\": \"Text\",\n        \"titlePosition\": \"center\"\n    },\n    {\n        \"type\": \"divider\",\n        \"title\": \"Text\",\n        \"titlePosition\": \"right\"\n    }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n<th>版本</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td><code>&quot;divider&quot;</code> 指定为 分割线 渲染器</td>\n<td></td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n<td></td>\n</tr>\n<tr>\n<td>lineStyle</td>\n<td><code>string</code></td>\n<td><code>solid</code></td>\n<td>分割线的样式，支持<code>dashed</code>和<code>solid</code></td>\n<td></td>\n</tr>\n<tr>\n<td>direction</td>\n<td><code>string</code></td>\n<td><code>horizontal</code></td>\n<td>分割线的方向，支持<code>horizontal</code>和<code>vertical</code></td>\n<td><code>3.5.0</code></td>\n</tr>\n<tr>\n<td>color</td>\n<td><code>string</code></td>\n<td></td>\n<td>分割线的颜色</td>\n<td><code>3.5.0</code></td>\n</tr>\n<tr>\n<td>rotate</td>\n<td><code>number</code></td>\n<td></td>\n<td>分割线的旋转角度</td>\n<td><code>3.5.0</code></td>\n</tr>\n<tr>\n<td>title</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>分割线的标题</td>\n<td><code>3.5.0</code></td>\n</tr>\n<tr>\n<td>titleClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>分割线的标题类名</td>\n<td><code>3.5.0</code></td>\n</tr>\n<tr>\n<td>titlePosition</td>\n<td><code>string</code></td>\n<td><code>center</code></td>\n<td>分割线的标题位置，支持<code>left</code>、<code>center</code>和<code>right</code></td>\n<td><code>3.5.0</code></td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "不同样式",
          "fragment": "%E4%B8%8D%E5%90%8C%E6%A0%B7%E5%BC%8F",
          "fullPath": "#%E4%B8%8D%E5%90%8C%E6%A0%B7%E5%BC%8F",
          "level": 2
        },
        {
          "label": "带标题的分割线",
          "fragment": "%E5%B8%A6%E6%A0%87%E9%A2%98%E7%9A%84%E5%88%86%E5%89%B2%E7%BA%BF",
          "fullPath": "#%E5%B8%A6%E6%A0%87%E9%A2%98%E7%9A%84%E5%88%86%E5%89%B2%E7%BA%BF",
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
