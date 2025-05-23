amis.define('docs/zh-CN/components/toast.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Toast 轻提示",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Toast",
    "icon": null,
    "order": 70,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"items\": [\n        {body: '轻提示内容'}\n      ]\n    }\n  },\n  {\n    \"label\": \"提示2\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"items\": [\n        {body: '轻提示内容2'}\n      ]\n    }\n  },\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%AE%BE%E7%BD%AE%E4%BD%8D%E7%BD%AE\" href=\"#%E8%AE%BE%E7%BD%AE%E4%BD%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>设置位置</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"position\": \"bottom-center\",\n      \"items\": [\n        {body: '轻提示内容2'}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%B8%8D%E5%B1%95%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE\" href=\"#%E4%B8%8D%E5%B1%95%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>不展示关闭按钮</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"closeButton\": false,\n      \"items\": [\n        {body: '轻提示内容'}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%85%B3%E9%97%AD%E5%9B%BE%E6%A0%87%E5%B1%95%E7%A4%BA\" href=\"#%E5%85%B3%E9%97%AD%E5%9B%BE%E6%A0%87%E5%B1%95%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>关闭图标展示</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"showIcon\": false,\n      \"items\": [\n        {body: '轻提示内容'}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4%E8%AE%BE%E7%BD%AE\" href=\"#%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4%E8%AE%BE%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>持续时间设置</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"timeout\": 1000,\n      \"items\": [\n        {body: '轻提示内容'}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B8%A6%E6%A0%87%E9%A2%98%E7%9A%84%E6%8F%90%E7%A4%BA\" href=\"#%E5%B8%A6%E6%A0%87%E9%A2%98%E7%9A%84%E6%8F%90%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>带标题的提示</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"items\": [\n        {title: '标题', body: '轻提示内容'}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E7%B1%BB%E5%9E%8B\" href=\"#%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E7%B1%BB%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>提示单独设置不同的类型</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"items\": [\n        {body: '普通消息提示', level: 'info'},\n        {body: '成功消息提示', level: 'success'},\n        {body: '错误消息提示', level: 'error'},\n        {body: '警告消息提示', level: 'warning'}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE\" href=\"#%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>提示单独设置不同的位置</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"items\": [\n        {body: '左上方提示', position: 'top-left'},\n        {body: '上方提示', position: 'top-center'},\n        {body: '右上方提示', position: 'top-right'},\n        {body: '中间提示', position: 'center'},\n        {body: '左下方提示', position: 'bottom-left'},\n        {body: '下方提示', position: 'bottom-center'},\n        {body: '右上下方提示', position: 'bottom-right'}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E6%98%AF%E5%90%A6%E5%B1%95%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE\" href=\"#%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E6%98%AF%E5%90%A6%E5%B1%95%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>提示单独设置是否展示关闭按钮</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"items\": [\n        {body: '展示关闭按钮', closeButton: true},\n        {body: '不展示关闭按钮', closeButton: false}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4\" href=\"#%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>提示单独设置不同的持续时间</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"items\": [\n        {body: '持续1秒', timeout: 1000},\n        {body: '持续3秒', timeout: 3000}\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%B8%B2%E6%9F%93-html\" href=\"#%E6%B8%B2%E6%9F%93-html\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>渲染 html</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"label\": \"提示\",\n    \"type\": \"button\",\n    \"actionType\": \"toast\",\n    \"toast\": {\n      \"items\": [\n        {body: '<strong>Hello</strong> <span>world</span>'},\n      ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>actionType</td>\n<td><code>string</code></td>\n<td><code>&quot;toast&quot;</code></td>\n<td>指定为 toast 轻提示组件</td>\n</tr>\n<tr>\n<td>items</td>\n<td><code>Array&lt;ToastItem&gt;</code></td>\n<td><code>[]</code></td>\n<td>轻提示内容</td>\n</tr>\n<tr>\n<td>position</td>\n<td><code>string</code></td>\n<td><code>top-center（移动端为center）</code></td>\n<td>提示显示位置，可用&#39;top-right&#39;、&#39;top-center&#39;、&#39;top-left&#39;、&#39;bottom-center&#39;、&#39;bottom-left&#39;、&#39;bottom-right&#39;、&#39;center&#39;</td>\n</tr>\n<tr>\n<td>closeButton</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否展示关闭按钮，移动端不展示</td>\n</tr>\n<tr>\n<td>showIcon</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否展示图标</td>\n</tr>\n<tr>\n<td>timeout</td>\n<td><code>number</code></td>\n<td><code>5000（error类型为6000，移动端为3000）</code></td>\n<td>持续时间</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"toastitem-%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#toastitem-%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ToastItem 属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>title</td>\n<td><code>string | SchemaNode</code></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>body</td>\n<td><code>string | SchemaNode</code></td>\n<td></td>\n<td>内容</td>\n</tr>\n<tr>\n<td>level</td>\n<td><code>string</code></td>\n<td><code>info</code></td>\n<td>展示图标，可选&#39;info&#39;、&#39;success&#39;、&#39;error&#39;、&#39;warning&#39;</td>\n</tr>\n<tr>\n<td>position</td>\n<td><code>string</code></td>\n<td><code>top-center（移动端为center）</code></td>\n<td>提示显示位置，可用&#39;top-right&#39;、&#39;top-center&#39;、&#39;top-left&#39;、&#39;bottom-center&#39;、&#39;bottom-left&#39;、&#39;bottom-right&#39;、&#39;center&#39;</td>\n</tr>\n<tr>\n<td>closeButton</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否展示关闭按钮</td>\n</tr>\n<tr>\n<td>showIcon</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否展示图标</td>\n</tr>\n<tr>\n<td>timeout</td>\n<td><code>number</code></td>\n<td><code>5000（error类型为6000，移动端为3000）</code></td>\n<td>持续时间</td>\n</tr>\n<tr>\n<td>allowHtml</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否会被当作 HTML 片段处理</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "设置位置",
          "fragment": "%E8%AE%BE%E7%BD%AE%E4%BD%8D%E7%BD%AE",
          "fullPath": "#%E8%AE%BE%E7%BD%AE%E4%BD%8D%E7%BD%AE",
          "level": 2
        },
        {
          "label": "不展示关闭按钮",
          "fragment": "%E4%B8%8D%E5%B1%95%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE",
          "fullPath": "#%E4%B8%8D%E5%B1%95%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE",
          "level": 2
        },
        {
          "label": "关闭图标展示",
          "fragment": "%E5%85%B3%E9%97%AD%E5%9B%BE%E6%A0%87%E5%B1%95%E7%A4%BA",
          "fullPath": "#%E5%85%B3%E9%97%AD%E5%9B%BE%E6%A0%87%E5%B1%95%E7%A4%BA",
          "level": 2
        },
        {
          "label": "持续时间设置",
          "fragment": "%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4%E8%AE%BE%E7%BD%AE",
          "fullPath": "#%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4%E8%AE%BE%E7%BD%AE",
          "level": 2
        },
        {
          "label": "带标题的提示",
          "fragment": "%E5%B8%A6%E6%A0%87%E9%A2%98%E7%9A%84%E6%8F%90%E7%A4%BA",
          "fullPath": "#%E5%B8%A6%E6%A0%87%E9%A2%98%E7%9A%84%E6%8F%90%E7%A4%BA",
          "level": 2
        },
        {
          "label": "提示单独设置不同的类型",
          "fragment": "%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E7%B1%BB%E5%9E%8B",
          "fullPath": "#%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E7%B1%BB%E5%9E%8B",
          "level": 2
        },
        {
          "label": "提示单独设置不同的位置",
          "fragment": "%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE",
          "fullPath": "#%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E4%BD%8D%E7%BD%AE",
          "level": 2
        },
        {
          "label": "提示单独设置是否展示关闭按钮",
          "fragment": "%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E6%98%AF%E5%90%A6%E5%B1%95%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE",
          "fullPath": "#%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E6%98%AF%E5%90%A6%E5%B1%95%E7%A4%BA%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE",
          "level": 2
        },
        {
          "label": "提示单独设置不同的持续时间",
          "fragment": "%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4",
          "fullPath": "#%E6%8F%90%E7%A4%BA%E5%8D%95%E7%8B%AC%E8%AE%BE%E7%BD%AE%E4%B8%8D%E5%90%8C%E7%9A%84%E6%8C%81%E7%BB%AD%E6%97%B6%E9%97%B4",
          "level": 2
        },
        {
          "label": "渲染 html",
          "fragment": "%E6%B8%B2%E6%9F%93-html",
          "fullPath": "#%E6%B8%B2%E6%9F%93-html",
          "level": 2
        },
        {
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2
        },
        {
          "label": "ToastItem 属性表",
          "fragment": "toastitem-%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#toastitem-%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
