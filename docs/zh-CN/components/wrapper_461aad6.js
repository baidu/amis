amis.define('docs/zh-CN/components/wrapper.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Wrapper 包裹容器",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Wrapper",
    "icon": null,
    "order": 72,
    "html": "<div class=\"markdown-body\"><p>简单的一个包裹容器组件，相当于用 div 包含起来，最大的用处是用来配合 css 进行布局。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"wrapper\",\n    \"body\": \"内容\",\n    \"className\": \"b\"\n}\n</script></div><div class=\"markdown-body\">\n<blockquote>\n<p>上面例子中的 <code>&quot;className&quot;: &quot;b&quot;</code> 是为了增加边框，不然看不出来。</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E8%8E%B7%E5%8F%96\" href=\"#%E5%8A%A8%E6%80%81%E8%8E%B7%E5%8F%96\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态获取</h2><p>直接返回一个对象</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"page\",\n  \"data\": {\n    \"style\": {\n      \"color\": \"#aaa\"\n    }\n  },\n  \"body\": [\n    {\n      \"type\": \"wrapper\",\n      \"body\": \"内容\",\n      \"className\": \"b\",\n      \"style\": \"${style}\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>返回变量</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"page\",\n  \"data\": {\n    \"color\": \"#aaa\"\n  },\n  \"body\": [\n    {\n      \"type\": \"wrapper\",\n      \"body\": \"内容\",\n      \"className\": \"b\",\n      \"style\": {\n        \"color\": \"${color}\",\n        \"fontSize\": \"30px\"\n      }\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%B8%8D%E5%90%8C%E5%86%85%E8%BE%B9%E8%B7%9D\" href=\"#%E4%B8%8D%E5%90%8C%E5%86%85%E8%BE%B9%E8%B7%9D\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>不同内边距</h2><p>通过配置<code>size</code>属性，可以调整内边距</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"wrapper\",\n    \"body\": \"默认内边距\",\n    \"className\": \"b\"\n  },\n  {\n    \"type\": \"divider\"\n  },\n  {\n    \"type\": \"wrapper\",\n    \"body\": \"极小的内边距\",\n    \"size\": \"xs\",\n    \"className\": \"b\"\n  },\n  {\n    \"type\": \"divider\"\n  },\n  {\n    \"type\": \"wrapper\",\n    \"body\": \"小的内边距\",\n    \"size\": \"sm\",\n    \"className\": \"b\"\n  },\n  {\n    \"type\": \"divider\"\n  },\n  {\n    \"type\": \"wrapper\",\n    \"body\": \"中等的内边距\",\n    \"size\": \"md\",\n    \"className\": \"b\"\n  },\n  {\n    \"type\": \"divider\"\n  },\n  {\n    \"type\": \"wrapper\",\n    \"body\": \"大的内边距\",\n    \"size\": \"lg\",\n    \"className\": \"b\"\n  },\n  {\n    \"type\": \"divider\"\n  },\n  {\n    \"type\": \"wrapper\",\n    \"body\": \"无内边距\",\n    \"size\": \"none\",\n    \"className\": \"b\"\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"style\" href=\"#style\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>style</h2><blockquote>\n<p>1.1.5 版本</p>\n</blockquote>\n<p>wrapper 可以设置 style，当成一个 <code>div</code> 标签来用</p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;wrapper&quot;</code></td>\n<td>指定为 Wrapper 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>size</td>\n<td><code>string</code></td>\n<td></td>\n<td>支持: <code>xs</code>、<code>sm</code>、<code>md</code>和<code>lg</code></td>\n</tr>\n<tr>\n<td>style</td>\n<td><code>Object</code> | <code>string</code></td>\n<td></td>\n<td>自定义样式</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>内容容器</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "动态获取",
          "fragment": "%E5%8A%A8%E6%80%81%E8%8E%B7%E5%8F%96",
          "fullPath": "#%E5%8A%A8%E6%80%81%E8%8E%B7%E5%8F%96",
          "level": 2
        },
        {
          "label": "不同内边距",
          "fragment": "%E4%B8%8D%E5%90%8C%E5%86%85%E8%BE%B9%E8%B7%9D",
          "fullPath": "#%E4%B8%8D%E5%90%8C%E5%86%85%E8%BE%B9%E8%B7%9D",
          "level": 2
        },
        {
          "label": "style",
          "fragment": "style",
          "fullPath": "#style",
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
