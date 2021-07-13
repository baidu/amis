amis.define('docs/zh-CN/components/json.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Json",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Json",
    "icon": null,
    "order": 54,
    "html": "<div class=\"markdown-body\"><p>JSON 展示组件</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>可以配置 <code>value</code> 展示 <code>json</code> 格式数据</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"json\",\n        \"value\": {\n            \"a\": \"a\",\n            \"b\": \"b\",\n            \"c\": {\n                \"d\": \"d\"\n            }\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE%E9%93%BE%E5%80%BC\" href=\"#%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE%E9%93%BE%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>获取数据链值</h2><p>也可以通过配置 <code>source</code> 获取数据链中的值</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"data\":{\n        \"json\":{\n            \"a\": \"a\",\n            \"b\": {\n                \"c\": \"c\"\n            }\n        }\n    },\n    \"body\": {\n        \"type\": \"json\",\n        \"source\": \"${json}\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" href=\"#%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>用作 Field 时</h2><p>当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置<code>name</code>属性，映射同名变量</p>\n<h3><a class=\"anchor\" name=\"table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" href=\"#table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Table 中的列类型</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"table\",\n    \"data\": {\n        \"items\": [\n            {\n                \"id\": \"1\",\n                \"json\": {\n                    \"a\": \"a1\",\n                    \"b\": {\n                        \"c\": \"c1\"\n                    }\n                }\n            },\n            {\n                \"id\": \"2\",\n                \"json\": {\n                    \"a\": \"a2\",\n                    \"b\": {\n                        \"c\": \"c2\"\n                    }\n                }\n            },\n            {\n                \"id\": \"3\",\n                \"json\": {\n                    \"a\": \"a3\",\n                    \"b\": {\n                        \"c\": \"c3\"\n                    }\n                }\n            }\n        ]\n    },\n    \"columns\": [\n        {\n            \"name\": \"id\",\n            \"label\": \"Id\"\n        },\n\n        {\n            \"name\": \"json\",\n            \"label\": \"颜色\",\n            \"type\": \"json\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>List 的内容、Card 卡片的内容配置同上</p>\n<h3><a class=\"anchor\" name=\"form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" href=\"#form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Form 中静态展示</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"data\": {\n        \"json\": {\n            \"a\": \"a\",\n            \"b\": {\n                \"c\": \"c\"\n            }\n        }\n    },\n    \"body\": [\n        {\n            \"type\": \"static-json\",\n            \"name\": \"json\",\n            \"label\": \"颜色\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%B8%BB%E9%A2%98\" href=\"#%E4%B8%BB%E9%A2%98\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>主题</h2><p>可配置<code>jsonTheme</code>，指定显示主题，可选<code>twilight</code>和<code>eighties</code>，默认为<code>twilight</code>。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n{\n    \"type\": \"json\",\n    \"value\": {\n        \"a\": \"a\",\n        \"b\": \"b\",\n        \"c\": {\n            \"d\": \"d\"\n        }\n    }\n},\n{\n    \"type\": \"divider\"\n},\n{\n    \"type\": \"json\",\n    \"jsonTheme\": \"eighties\",\n    \"value\": {\n        \"a\": \"a\",\n        \"b\": \"b\",\n        \"c\": {\n            \"d\": \"d\"\n        }\n    }\n}\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E9%BB%98%E8%AE%A4%E5%B1%95%E5%BC%80%E5%B1%82%E7%BA%A7\" href=\"#%E9%85%8D%E7%BD%AE%E9%BB%98%E8%AE%A4%E5%B1%95%E5%BC%80%E5%B1%82%E7%BA%A7\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置默认展开层级</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"json\",\n        \"levelExpand\": 0,\n        \"value\": {\n            \"a\": \"a\",\n            \"b\": \"b\",\n            \"c\": {\n                \"d\": \"d\"\n            }\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<p>如上，<code>levelExpand</code>配置为<code>0</code>，则默认不展开。</p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td>如果在 Table、Card 和 List 中，为<code>&quot;json&quot;</code>；在 Form 中用作静态展示，为<code>&quot;static-json&quot;</code></td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>value</td>\n<td><code>object</code>/<code>string</code></td>\n<td></td>\n<td>json 值，如果是 string 会自动 parse</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code></td>\n<td><code>&#39;&#39;</code></td>\n<td>通过数据映射获取数据链中的值</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td><code>-</code></td>\n<td>占位文本</td>\n</tr>\n<tr>\n<td>levelExpand</td>\n<td><code>number</code></td>\n<td><code>1</code></td>\n<td>默认展开的层级</td>\n</tr>\n<tr>\n<td>hideRoot</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否隐藏根节点</td>\n</tr>\n<tr>\n<td>jsonTheme</td>\n<td><code>string</code></td>\n<td><code>twilight</code></td>\n<td>主题，可选<code>twilight</code>和<code>eighties</code></td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "获取数据链值",
          "fragment": "%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE%E9%93%BE%E5%80%BC",
          "fullPath": "#%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE%E9%93%BE%E5%80%BC",
          "level": 2
        },
        {
          "label": "用作 Field 时",
          "fragment": "%E7%94%A8%E4%BD%9C-field-%E6%97%B6",
          "fullPath": "#%E7%94%A8%E4%BD%9C-field-%E6%97%B6",
          "level": 2,
          "children": [
            {
              "label": "Table 中的列类型",
              "fragment": "table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B",
              "fullPath": "#table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B",
              "level": 3
            },
            {
              "label": "Form 中静态展示",
              "fragment": "form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA",
              "fullPath": "#form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA",
              "level": 3
            }
          ]
        },
        {
          "label": "主题",
          "fragment": "%E4%B8%BB%E9%A2%98",
          "fullPath": "#%E4%B8%BB%E9%A2%98",
          "level": 2
        },
        {
          "label": "配置默认展开层级",
          "fragment": "%E9%85%8D%E7%BD%AE%E9%BB%98%E8%AE%A4%E5%B1%95%E5%BC%80%E5%B1%82%E7%BA%A7",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E9%BB%98%E8%AE%A4%E5%B1%95%E5%BC%80%E5%B1%82%E7%BA%A7",
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
