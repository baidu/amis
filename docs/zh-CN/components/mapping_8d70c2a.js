amis.define('docs/zh-CN/components/mapping.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Mapping 映射",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Mapping 映射",
    "icon": null,
    "order": 57,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"mapping\",\n        \"value\": \"1\",\n        \"map\": {\n            \"1\": \"第一\",\n            \"2\": \"第二\",\n            \"3\": \"第三\",\n            \"*\": \"其他\"\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%B8%B2%E6%9F%93-html\" href=\"#%E6%B8%B2%E6%9F%93-html\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>渲染 HTML</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"mapping\",\n        \"value\": \"2\",\n        \"map\": {\n            \"1\": \"<span class='label label-info'>漂亮</span>\",\n            \"2\": \"<span class='label label-success'>开心</span>\",\n            \"3\": \"<span class='label label-danger'>惊吓</span>\",\n            \"4\": \"<span class='label label-warning'>紧张</span>\",\n            \"*\": \"<span class='label label-default'>其他：${type}</span>\"\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" href=\"#%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>用作 Field 时</h2><p>当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置<code>name</code>属性，映射同名变量</p>\n<h3><a class=\"anchor\" name=\"table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" href=\"#table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Table 中的列类型</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"table\",\n    \"data\": {\n        \"items\": [\n            {\n                \"id\": \"1\",\n                \"type\": \"1\"\n            },\n            {\n                \"id\": \"2\",\n                \"type\": \"2\"\n            },\n            {\n                \"id\": \"3\",\n                \"type\": \"3\"\n            }\n        ]\n    },\n    \"columns\": [\n        {\n            \"name\": \"id\",\n            \"label\": \"Id\"\n        },\n\n        {\n            \"name\": \"type\",\n            \"label\": \"映射\",\n            \"type\": \"mapping\",\n            \"map\": {\n                \"1\": \"<span class='label label-info'>漂亮</span>\",\n                \"2\": \"<span class='label label-success'>开心</span>\",\n                \"3\": \"<span class='label label-danger'>惊吓</span>\",\n                \"4\": \"<span class='label label-warning'>紧张</span>\",\n                \"*\": \"其他：${type}\"\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>List 的内容、Card 卡片的内容配置同上</p>\n<h3><a class=\"anchor\" name=\"form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" href=\"#form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Form 中静态展示</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"data\": {\n        \"type\": \"2\"\n    },\n    \"body\": [\n        {\n            \"type\": \"static-mapping\",\n            \"name\": \"type\",\n            \"label\": \"映射\",\n            \"map\": {\n                \"1\": \"<span class='label label-info'>漂亮</span>\",\n                \"2\": \"<span class='label label-success'>开心</span>\",\n                \"3\": \"<span class='label label-danger'>惊吓</span>\",\n                \"4\": \"<span class='label label-warning'>紧张</span>\",\n                \"*\": \"其他：${type}\"\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E5%B8%83%E5%B0%94%E5%80%BC%E6%98%A0%E5%B0%84\" href=\"#%E5%B8%83%E5%B0%94%E5%80%BC%E6%98%A0%E5%B0%84\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>布尔值映射</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"data\": {\n        \"type\": true\n    },\n    \"body\": [\n        {\n            \"type\": \"static-mapping\",\n            \"name\": \"type\",\n            \"label\": \"映射\",\n            \"map\": {\n                \"1\": \"<span class='label label-info'>开</span>\",\n                \"0\": \"<span class='label label-default'>关</span>\"\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>或者</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"data\": {\n        \"type\": true\n    },\n    \"body\": [\n        {\n            \"type\": \"static-mapping\",\n            \"name\": \"type\",\n            \"label\": \"映射\",\n            \"map\": {\n                \"true\": \"<span class='label label-info'>开</span>\",\n                \"false\": \"<span class='label label-default'>关</span>\"\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E8%BF%9C%E7%A8%8B%E6%8B%89%E5%8F%96%E5%AD%97%E5%85%B8\" href=\"#%E8%BF%9C%E7%A8%8B%E6%8B%89%E5%8F%96%E5%AD%97%E5%85%B8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>远程拉取字典</h3><blockquote>\n<p>since 1.1.6</p>\n</blockquote>\n<p>通过配置 <code>source</code> 接口来实现，接口返回字典对象即可，数据格式参考 map 配置。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"data\": {\n        \"type\": \"2\"\n    },\n    \"body\": [\n        {\n            \"type\": \"mapping\",\n            \"name\": \"type\",\n            \"label\": \"映射\",\n            \"source\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mapping\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<blockquote>\n<p>默认 source 是有 30s 缓存的，通常字典数据不长变更。如果想修改，请参考 <a href=\"../../../docs/types/api\">API</a> 文档配置缓存。</p>\n</blockquote>\n<h3><a class=\"anchor\" name=\"%E5%85%B3%E8%81%94%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8F%98%E9%87%8F\" href=\"#%E5%85%B3%E8%81%94%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8F%98%E9%87%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>关联上下文变量</h3><blockquote>\n<p>since 1.1.6</p>\n</blockquote>\n<p>同样通过配置 <code>source</code> 来实现，只是格式是取变量。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"initApi\": {\n        \"url\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mapping\",\n        \"method\": \"get\",\n        \"responseData\": {\n            \"zidian\": \"$$$$\",\n            \"type\": \"2\"\n        }\n    },\n    \"body\": [\n        {\n            \"type\": \"mapping\",\n            \"name\": \"type\",\n            \"label\": \"映射\",\n            \"source\": \"$${zidian}\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td>如果在 Table、Card 和 List 中，为<code>&quot;color&quot;</code>；在 Form 中用作静态展示，为<code>&quot;static-color&quot;</code></td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td></td>\n<td>占位文本</td>\n</tr>\n<tr>\n<td>map</td>\n<td><code>object</code></td>\n<td></td>\n<td>映射配置</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code> or <code>API</code></td>\n<td></td>\n<td><a href=\"../../../docs/types/api\">API</a> 或 <a href=\"../../../docs/concepts/data-mapping\">数据映射</a></td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "渲染 HTML",
          "fragment": "%E6%B8%B2%E6%9F%93-html",
          "fullPath": "#%E6%B8%B2%E6%9F%93-html",
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
            },
            {
              "label": "布尔值映射",
              "fragment": "%E5%B8%83%E5%B0%94%E5%80%BC%E6%98%A0%E5%B0%84",
              "fullPath": "#%E5%B8%83%E5%B0%94%E5%80%BC%E6%98%A0%E5%B0%84",
              "level": 3
            },
            {
              "label": "远程拉取字典",
              "fragment": "%E8%BF%9C%E7%A8%8B%E6%8B%89%E5%8F%96%E5%AD%97%E5%85%B8",
              "fullPath": "#%E8%BF%9C%E7%A8%8B%E6%8B%89%E5%8F%96%E5%AD%97%E5%85%B8",
              "level": 3
            },
            {
              "label": "关联上下文变量",
              "fragment": "%E5%85%B3%E8%81%94%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8F%98%E9%87%8F",
              "fullPath": "#%E5%85%B3%E8%81%94%E4%B8%8A%E4%B8%8B%E6%96%87%E5%8F%98%E9%87%8F",
              "level": 3
            }
          ]
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
