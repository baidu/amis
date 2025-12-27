amis.define('docs/zh-CN/components/sparkline.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Sparkline 走势图",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "SparkLine",
    "icon": null,
    "order": 63,
    "html": "<div class=\"markdown-body\"><p>简单走势图，只做简单的展示，详细展示请采用 Chart 来完成。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2><p>配置类型，然后设置值即可，值为数组格式。</p>\n<p>当前例子为静态值，通常你会需要配置成 <code>name</code> 与当前环境数据关联。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"sparkline\",\n        \"height\": 30,\n        \"value\": [3, 5, 2, 4, 1, 8, 3, 7]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%82%B9%E5%87%BB%E8%A1%8C%E4%B8%BA\" href=\"#%E7%82%B9%E5%87%BB%E8%A1%8C%E4%B8%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>点击行为</h2><p>可以通过配置<code>&quot;clickAction&quot;: {}</code>，来指定图表节点的点击行为，支持 amis 的 <a href=\"./action\">行为</a>。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"sparkline\",\n        \"value\": [3, 5, 2, 4, 1, 8, 3, 7],\n        \"clickAction\": {\n          \"actionType\": \"dialog\",\n          \"dialog\": {\n            \"title\": \"走势详情\",\n            \"body\": \"这里你可以放个 chart 来展示详情。\"\n          }\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%A9%BA%E6%95%B0%E6%8D%AE%E6%98%BE%E7%A4%BA\" href=\"#%E7%A9%BA%E6%95%B0%E6%8D%AE%E6%98%BE%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>空数据显示</h2><blockquote>\n<p>1.4.2 及以上版本</p>\n</blockquote>\n<p>通过 <code>placeholder</code> 可以设置空数据时显示的内容</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"sparkline\",\n        \"value\": [],\n        \"placeholder\": \"无数据\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>name</td>\n<td><code>string</code></td>\n<td></td>\n<td>关联的变量</td>\n</tr>\n<tr>\n<td>width</td>\n<td><code>number</code></td>\n<td></td>\n<td>宽度</td>\n</tr>\n<tr>\n<td>height</td>\n<td><code>number</code></td>\n<td></td>\n<td>高度</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td></td>\n<td>数据为空时显示的内容</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本使用",
          "fragment": "%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "level": 2
        },
        {
          "label": "点击行为",
          "fragment": "%E7%82%B9%E5%87%BB%E8%A1%8C%E4%B8%BA",
          "fullPath": "#%E7%82%B9%E5%87%BB%E8%A1%8C%E4%B8%BA",
          "level": 2
        },
        {
          "label": "空数据显示",
          "fragment": "%E7%A9%BA%E6%95%B0%E6%8D%AE%E6%98%BE%E7%A4%BA",
          "fullPath": "#%E7%A9%BA%E6%95%B0%E6%8D%AE%E6%98%BE%E7%A4%BA",
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
