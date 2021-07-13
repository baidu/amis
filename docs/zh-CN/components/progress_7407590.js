amis.define('docs/zh-CN/components/progress.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Progress 进度条",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Progress 进度条",
    "icon": null,
    "order": 60,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"progress\",\n        \"value\": 60\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%A2%9C%E8%89%B2%E6%98%A0%E5%B0%84\" href=\"#%E9%A2%9C%E8%89%B2%E6%98%A0%E5%B0%84\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>颜色映射</h2><p>可以配置<code>map</code>，指定颜色映射，例如，默认的 map 配置为：<code>[&#39;bg-danger&#39;, &#39;bg-warning&#39;, &#39;bg-info&#39;, &#39;bg-success&#39;, &#39;bg-success&#39;]</code></p>\n<p>它意味着将进度条分成了 5 份，<code>前20%</code>将会添加<code>bg-danger</code> css 类名到进度条上，<code>20%~40%</code>，将会添加<code>bg-warning</code>，以此类推，你可以自定义<code>map</code>来配置想要的进度效果</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": [\n        {\n            \"type\": \"progress\",\n            \"value\": 40,\n            \"map\": [\"bg-danger\", \"bg-success\"]\n        },\n        {\n            \"type\": \"divider\"\n        },\n        {\n            \"type\": \"progress\",\n            \"value\": 60,\n            \"map\": [\"bg-danger\", \"bg-success\"]\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" href=\"#%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>用作 Field 时</h2><p>当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置<code>name</code>属性，映射同名变量</p>\n<h3><a class=\"anchor\" name=\"table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" href=\"#table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Table 中的列类型</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"table\",\n    \"data\": {\n        \"items\": [\n            {\n                \"id\": \"1\",\n                \"progress\": 20\n            },\n            {\n                \"id\": \"2\",\n                \"progress\": 40\n            },\n            {\n                \"id\": \"3\",\n                \"progress\": 60\n            }\n        ]\n    },\n    \"columns\": [\n        {\n            \"name\": \"id\",\n            \"label\": \"Id\"\n        },\n\n        {\n            \"name\": \"progress\",\n            \"label\": \"进度\",\n            \"type\": \"progress\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>List 的内容、Card 卡片的内容配置同上</p>\n<h3><a class=\"anchor\" name=\"form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" href=\"#form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Form 中静态展示</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"data\": {\n        \"progress\": 60\n    },\n    \"body\": [\n        {\n            \"type\": \"static-progress\",\n            \"name\": \"progress\",\n            \"label\": \"进度\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%98%BE%E7%A4%BA%E8%83%8C%E6%99%AF%E9%97%B4%E9%9A%94\" href=\"#%E6%98%BE%E7%A4%BA%E8%83%8C%E6%99%AF%E9%97%B4%E9%9A%94\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>显示背景间隔</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"progress\",\n        \"stripe\": true,\n        \"value\": 60\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%98%BE%E7%A4%BA%E5%8A%A8%E7%94%BB\" href=\"#%E6%98%BE%E7%A4%BA%E5%8A%A8%E7%94%BB\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>显示动画</h2><p>需要同时开启显示背景间隔才能看出来</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"progress\",\n        \"stripe\": true,\n        \"animate\": true,\n        \"value\": 60\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td>如果在 Table、Card 和 List 中，为<code>&quot;color&quot;</code>；在 Form 中用作静态展示，为<code>&quot;static-color&quot;</code></td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>progressClassName</td>\n<td><code>string</code></td>\n<td><code>progress-xs progress-striped active m-b-none</code></td>\n<td>进度调 CSS 类名</td>\n</tr>\n<tr>\n<td>progressBarClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>完成进度条 CSS 类名</td>\n</tr>\n<tr>\n<td>value</td>\n<td><code>string</code></td>\n<td></td>\n<td>进度值</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td><code>-</code></td>\n<td>占位文本</td>\n</tr>\n<tr>\n<td>showLabel</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否展示进度文本</td>\n</tr>\n<tr>\n<td>strip</td>\n<td><code>boolean</code></td>\n<td><code> false</code></td>\n<td>背景是否显示条纹</td>\n</tr>\n<tr>\n<td>animate</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>背景条纹是否有动画</td>\n</tr>\n<tr>\n<td>map</td>\n<td><code>Array&lt;string&gt;</code></td>\n<td><code>[&#39;bg-danger&#39;, &#39;bg-warning&#39;, &#39;bg-info&#39;, &#39;bg-success&#39;, &#39;bg-success&#39;]</code></td>\n<td>进度颜色映射</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "颜色映射",
          "fragment": "%E9%A2%9C%E8%89%B2%E6%98%A0%E5%B0%84",
          "fullPath": "#%E9%A2%9C%E8%89%B2%E6%98%A0%E5%B0%84",
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
          "label": "显示背景间隔",
          "fragment": "%E6%98%BE%E7%A4%BA%E8%83%8C%E6%99%AF%E9%97%B4%E9%9A%94",
          "fullPath": "#%E6%98%BE%E7%A4%BA%E8%83%8C%E6%99%AF%E9%97%B4%E9%9A%94",
          "level": 2
        },
        {
          "label": "显示动画",
          "fragment": "%E6%98%BE%E7%A4%BA%E5%8A%A8%E7%94%BB",
          "fullPath": "#%E6%98%BE%E7%A4%BA%E5%8A%A8%E7%94%BB",
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
