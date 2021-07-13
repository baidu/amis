amis.define('docs/zh-CN/components/qrcode.md', function(require, exports, module, define) {

  module.exports = {
    "title": "QRCode 二维码",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "QRCode 二维码",
    "icon": null,
    "order": 61,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"qr-code\",\n    \"codeSize\": 128,\n    \"value\": \"https://www.baidu.com\"\n}\n</script></div><div class=\"markdown-body\">\n<blockquote>\n<p>根据 QR 码国际标准，二进制模式最多可存储<code>2953</code>字节的内容（1 中文汉字=2 字节）</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E8%83%8C%E6%99%AF%E8%89%B2\" href=\"#%E9%85%8D%E7%BD%AE%E8%83%8C%E6%99%AF%E8%89%B2\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置背景色</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n    {\n        \"type\": \"qr-code\",\n        \"codeSize\": 128,\n        \"backgroundColor\": \"#108cee\",\n        \"foregroundColor\": \"#000\",\n        \"value\": \"https://www.baidu.com\"\n    }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E5%89%8D%E6%99%AF%E8%89%B2\" href=\"#%E9%85%8D%E7%BD%AE%E5%89%8D%E6%99%AF%E8%89%B2\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置前景色</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n    {\n        \"type\": \"qr-code\",\n        \"codeSize\": 128,\n        \"backgroundColor\": \"#fff\",\n        \"foregroundColor\": \"#108cee\",\n        \"value\": \"https://www.baidu.com\"\n    }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%B8%8D%E5%90%8C%E5%A4%8D%E6%9D%82%E5%BA%A6\" href=\"#%E4%B8%8D%E5%90%8C%E5%A4%8D%E6%9D%82%E5%BA%A6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>不同复杂度</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"hbox\",\n  \"columns\": [\n    {\n      \"type\": \"qr-code\",\n      \"codeSize\": 128,\n      \"level\": \"L\",\n      \"value\": \"https://www.baidu.com\"\n    },\n    {\n      \"type\": \"qr-code\",\n      \"codeSize\": 128,\n      \"level\": \"M\",\n      \"value\": \"https://www.baidu.com\"\n    },\n    {\n      \"type\": \"qr-code\",\n      \"codeSize\": 128,\n      \"level\": \"Q\",\n      \"value\": \"https://www.baidu.com\"\n    },\n    {\n      \"type\": \"qr-code\",\n      \"codeSize\": 128,\n      \"level\": \"H\",\n      \"value\": \"https://www.baidu.com\"\n    }\n  ]\n}\n\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;qr-code&quot;</code></td>\n<td>指定为 QRCode 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>qrcodeClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>二维码 SVG 的类名</td>\n</tr>\n<tr>\n<td>codeSize</td>\n<td><code>number</code></td>\n<td><code>128</code></td>\n<td>二维码的宽高大小</td>\n</tr>\n<tr>\n<td>backgroundColor</td>\n<td><code>string</code></td>\n<td><code>&quot;#fff&quot;</code></td>\n<td>二维码背景色</td>\n</tr>\n<tr>\n<td>foregroundColor</td>\n<td><code>string</code></td>\n<td><code>&quot;#000&quot;</code></td>\n<td>二维码前景色</td>\n</tr>\n<tr>\n<td>level</td>\n<td><code>string</code></td>\n<td><code>&quot;L&quot;</code></td>\n<td>二维码复杂级别，有（&#39;L&#39; &#39;M&#39; &#39;Q&#39; &#39;H&#39;）四种</td>\n</tr>\n<tr>\n<td>value</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td><code>&quot;https://www.baidu.com&quot;</code></td>\n<td>扫描二维码后显示的文本，如果要显示某个页面请输入完整 url（<code>&quot;http://...&quot;</code>或<code>&quot;https://...&quot;</code>开头），支持使用 <a href=\"./concepts/template\">模板</a></td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "配置背景色",
          "fragment": "%E9%85%8D%E7%BD%AE%E8%83%8C%E6%99%AF%E8%89%B2",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E8%83%8C%E6%99%AF%E8%89%B2",
          "level": 2
        },
        {
          "label": "配置前景色",
          "fragment": "%E9%85%8D%E7%BD%AE%E5%89%8D%E6%99%AF%E8%89%B2",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E5%89%8D%E6%99%AF%E8%89%B2",
          "level": 2
        },
        {
          "label": "不同复杂度",
          "fragment": "%E4%B8%8D%E5%90%8C%E5%A4%8D%E6%9D%82%E5%BA%A6",
          "fullPath": "#%E4%B8%8D%E5%90%8C%E5%A4%8D%E6%9D%82%E5%BA%A6",
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
