amis.define('docs/zh-CN/components/button-group.md', function(require, exports, module, define) {

  module.exports = {
    "title": "ButtonGroup 按钮组",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "ButtonGroup",
    "icon": null,
    "order": 30,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"button-group\",\n  \"buttons\": [\n    {\n      \"type\": \"button\",\n      \"label\": \"Button\",\n      \"actionType\": \"dialog\",\n      \"dialog\": {\n        \"confirmMode\": false,\n        \"title\": \"提示\",\n        \"body\": \"对，你刚点击了！\"\n      }\n    },\n\n    {\n      \"type\": \"button\",\n      \"actionType\": \"url\",\n      \"url\": \"https://www.baidu.com\",\n      \"blank\": true,\n      \"label\": \"百度一下\"\n    },\n\n    {\n      \"type\": \"button\",\n      \"label\": \"普通按钮\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%9E%82%E7%9B%B4%E6%A8%A1%E5%BC%8F\" href=\"#%E5%9E%82%E7%9B%B4%E6%A8%A1%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>垂直模式</h2><p>配置<code>&quot;vertical&quot;: true</code>，实现垂直模式</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"button-group\",\n    \"vertical\": true,\n    \"buttons\": [\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮1\"\n      },\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮2\"\n      },\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮3\"\n      }\n    ]\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B9%B3%E9%93%BA%E6%A8%A1%E5%BC%8F\" href=\"#%E5%B9%B3%E9%93%BA%E6%A8%A1%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>平铺模式</h2><p>配置 <code>&quot;tiled&quot;: true</code> 实现平铺模式</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"button-group\",\n    \"tiled\": true,\n    \"buttons\": [\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮1\"\n      },\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮2\"\n      },\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮3\"\n      }\n    ]\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%8C%89%E9%92%AE%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F\" href=\"#%E6%8C%89%E9%92%AE%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>按钮主题样式</h2><p>配置 <code>btnLevel</code> 统一设置按钮主题样式，注意 <code>buttons </code> 或 <code>options</code> 中的<code>level</code>属性优先级高于<code>btnLevel</code>。配置 <code>btnActiveLevel</code> 为按钮设置激活态时的主题样式。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"button-group\",\n    \"btnLevel\": \"light\",\n    \"btnActiveLevel\": \"warning\",\n    \"buttons\": [\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮1\"\n      },\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮2\"\n      },\n      {\n        \"type\": \"button\",\n        \"label\": \"按钮3\",\n        \"level\": \"primary\"\n      }\n    ]\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;button-group&quot;</code></td>\n<td>指定为 button-group 渲染器</td>\n</tr>\n<tr>\n<td>vertical</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否使用垂直模式</td>\n</tr>\n<tr>\n<td>tiled</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否使用平铺模式</td>\n</tr>\n<tr>\n<td>btnLevel</td>\n<td><code>&#39;link&#39; | &#39;primary&#39; | &#39;secondary&#39; | &#39;info&#39;|&#39;success&#39; | &#39;warning&#39; | &#39;danger&#39; | &#39;light&#39;| &#39;dark&#39; | &#39;default&#39;</code></td>\n<td><code>&quot;default&quot;</code></td>\n<td>按钮样式</td>\n</tr>\n<tr>\n<td>btnActiveLevel</td>\n<td><code>&#39;link&#39; | &#39;primary&#39; | &#39;secondary&#39; | &#39;info&#39;|&#39;success&#39; | &#39;warning&#39; | &#39;danger&#39; | &#39;light&#39;| &#39;dark&#39; | &#39;default&#39;</code></td>\n<td><code>&quot;default&quot;</code></td>\n<td>选中按钮样式</td>\n</tr>\n<tr>\n<td>buttons</td>\n<td><code>Array&lt;Action&gt;</code></td>\n<td></td>\n<td><a href=\"./action\">按钮</a></td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "垂直模式",
          "fragment": "%E5%9E%82%E7%9B%B4%E6%A8%A1%E5%BC%8F",
          "fullPath": "#%E5%9E%82%E7%9B%B4%E6%A8%A1%E5%BC%8F",
          "level": 2
        },
        {
          "label": "平铺模式",
          "fragment": "%E5%B9%B3%E9%93%BA%E6%A8%A1%E5%BC%8F",
          "fullPath": "#%E5%B9%B3%E9%93%BA%E6%A8%A1%E5%BC%8F",
          "level": 2
        },
        {
          "label": "按钮主题样式",
          "fragment": "%E6%8C%89%E9%92%AE%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F",
          "fullPath": "#%E6%8C%89%E9%92%AE%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F",
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
