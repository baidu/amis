amis.define('docs/zh-CN/components/alert.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Alert 提示",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Alert 提示",
    "icon": null,
    "order": 27,
    "html": "<div class=\"markdown-body\"><p>用来做文字特殊提示，分为四类：提示类、成功类、警告类和危险类。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"alert\",\n    \"body\": \"提示类提示\",\n    \"level\": \"info\"\n  },\n  {\n    \"type\": \"alert\",\n    \"body\": \"成功类提示\",\n    \"level\": \"success\"\n  },\n  {\n    \"type\": \"alert\",\n    \"body\": \"警告类提示\",\n    \"level\": \"warning\"\n  },\n  {\n    \"type\": \"alert\",\n    \"body\": \"危险类提示\",\n    \"level\": \"danger\"\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%98%BE%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE\" href=\"#%E6%98%BE%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>显示关闭按钮</h2><p>配置<code>&quot;showCloseButton&quot;: true</code>实现显示关闭按钮。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"alert\",\n    \"body\": \"默认提示\",\n    \"level\": \"info\"\n  },\n  {\n    \"type\": \"alert\",\n    \"body\": \"显示关闭按钮的提示\",\n    \"level\": \"info\",\n    \"showCloseButton\": true\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;alert&quot;</code></td>\n<td>指定为 alert 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>level</td>\n<td><code>string</code></td>\n<td><code>info</code></td>\n<td>级别，可以是：<code>info</code>、<code>success</code>、<code>warning</code> 或者 <code>danger</code></td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>显示内容</td>\n</tr>\n<tr>\n<td>showCloseButton</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>是否显示关闭按钮</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "显示关闭按钮",
          "fragment": "%E6%98%BE%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE",
          "fullPath": "#%E6%98%BE%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE",
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
