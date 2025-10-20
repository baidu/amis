amis.define('docs/zh-CN/components/remark.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Remark 标记",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Remark",
    "icon": null,
    "order": 62,
    "html": "<div class=\"markdown-body\"><p>用于展示提示文本，和表单项中的 remark 属性类型。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"remark\",\n        \"content\": \"这是一段提醒\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%9B%BE%E6%A0%87%E5%BD%A2%E7%8A%B6\" href=\"#%E5%9B%BE%E6%A0%87%E5%BD%A2%E7%8A%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>图标形状</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"remark\",\n        \"content\": \"这是一段提醒\",\n        \"shape\": \"circle\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8F%AF%E9%85%8D%E7%BD%AE%E6%A0%87%E9%A2%98\" href=\"#%E5%8F%AF%E9%85%8D%E7%BD%AE%E6%A0%87%E9%A2%98\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>可配置标题</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"remark\",\n        \"content\": {\n            \"title\": \"标题\",\n            \"body\": \"这是一段提醒\"\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%94%AF%E6%8C%81%E5%8F%98%E9%87%8F\" href=\"#%E6%94%AF%E6%8C%81%E5%8F%98%E9%87%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>支持变量</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"data\": {\n        \"github\": \"https://github.com/\"\n    },\n    \"body\": [\n        {\n            \"type\": \"remark\",\n            \"content\": \"${github}\"\n        },\n        {\n            \"type\": \"remark\",\n            \"content\": {\n                \"title\": \"${github|raw}\",\n                \"body\": \"${github}\"\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%BC%B9%E5%87%BA%E4%BD%8D%E7%BD%AE\" href=\"#%E5%BC%B9%E5%87%BA%E4%BD%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>弹出位置</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n    {\n        \"type\": \"remark\",\n        \"content\": \"向上\",\n        \"placement\": \"top\"\n    },\n    {\n        \"type\": \"remark\",\n        \"content\": \"向下\",\n        \"placement\": \"bottom\"\n    },\n    {\n        \"type\": \"remark\",\n        \"content\": \"向左\",\n        \"placement\": \"left\"\n    },\n    {\n        \"type\": \"remark\",\n        \"content\": \"向右\",\n        \"placement\": \"right\"\n    }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td><code>remark</code></td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>content</td>\n<td><code>string</code></td>\n<td></td>\n<td>提示文本</td>\n</tr>\n<tr>\n<td>placement</td>\n<td><code>string</code></td>\n<td></td>\n<td>弹出位置</td>\n</tr>\n<tr>\n<td>trigger</td>\n<td><code>string</code></td>\n<td><code>[&#39;hover&#39;, &#39;focus&#39;]</code></td>\n<td>触发条件</td>\n</tr>\n<tr>\n<td>icon</td>\n<td><code>string</code></td>\n<td><code>fa fa-question-circle</code></td>\n<td>图标</td>\n</tr>\n<tr>\n<td>shape</td>\n<td><code>&#39;circle&#39; | &#39;square&#39;</code></td>\n<td>图标形状</td>\n<td></td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "图标形状",
          "fragment": "%E5%9B%BE%E6%A0%87%E5%BD%A2%E7%8A%B6",
          "fullPath": "#%E5%9B%BE%E6%A0%87%E5%BD%A2%E7%8A%B6",
          "level": 2
        },
        {
          "label": "可配置标题",
          "fragment": "%E5%8F%AF%E9%85%8D%E7%BD%AE%E6%A0%87%E9%A2%98",
          "fullPath": "#%E5%8F%AF%E9%85%8D%E7%BD%AE%E6%A0%87%E9%A2%98",
          "level": 2
        },
        {
          "label": "支持变量",
          "fragment": "%E6%94%AF%E6%8C%81%E5%8F%98%E9%87%8F",
          "fullPath": "#%E6%94%AF%E6%8C%81%E5%8F%98%E9%87%8F",
          "level": 2
        },
        {
          "label": "弹出位置",
          "fragment": "%E5%BC%B9%E5%87%BA%E4%BD%8D%E7%BD%AE",
          "fullPath": "#%E5%BC%B9%E5%87%BA%E4%BD%8D%E7%BD%AE",
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
