amis.define('docs/zh-CN/components/color.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Color 颜色",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Color",
    "icon": null,
    "order": 37,
    "html": "<div class=\"markdown-body\"><p>用于展示颜色</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"color\",\n        \"value\": \"#108cee\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" href=\"#%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>用作 Field 时</h2><p>当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置<code>name</code>属性，映射同名变量</p>\n<h3><a class=\"anchor\" name=\"table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" href=\"#table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Table 中的列类型</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"table\",\n    \"data\": {\n        \"items\": [\n            {\n                \"id\": \"1\",\n                \"color\": \"#108cee\"\n            },\n            {\n                \"id\": \"2\",\n                \"color\": \"#f38900\"\n            },\n            {\n                \"id\": \"3\",\n                \"color\": \"#04c1ba\"\n            }\n        ]\n    },\n    \"columns\": [\n        {\n            \"name\": \"id\",\n            \"label\": \"Id\"\n        },\n\n        {\n            \"name\": \"color\",\n            \"label\": \"颜色\",\n            \"type\": \"color\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>List 的内容、Card 卡片的内容配置同上</p>\n<h3><a class=\"anchor\" name=\"form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" href=\"#form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Form 中静态展示</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"data\": {\n        \"color\": \"#108cee\"\n    },\n    \"body\": [\n        {\n            \"type\": \"static-color\",\n            \"name\": \"color\",\n            \"label\": \"颜色\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td>如果在 Table、Card 和 List 中，为<code>&quot;color&quot;</code>；在 Form 中用作静态展示，为<code>&quot;static-color&quot;</code></td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>value</td>\n<td><code>string</code></td>\n<td></td>\n<td>显示的颜色值</td>\n</tr>\n<tr>\n<td>name</td>\n<td><code>string</code></td>\n<td></td>\n<td>在其他组件中，时，用作变量映射</td>\n</tr>\n<tr>\n<td>defaultColor</td>\n<td><code>string</code></td>\n<td><code>#ccc</code></td>\n<td>默认颜色值</td>\n</tr>\n<tr>\n<td>showValue</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否显示右边的颜色值</td>\n</tr>\n</tbody></table>\n</div>",
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
