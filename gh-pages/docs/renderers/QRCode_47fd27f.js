define('docs/renderers/QRCode.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"qrcode\" href=\"#qrcode\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>QRCode</h2><p>二维码显示组件</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;qr-code&quot;</code></td>\n<td>指定为 QRCode 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>codeSize</td>\n<td><code>number</code></td>\n<td><code>128</code></td>\n<td>二维码的宽高大小</td>\n</tr>\n<tr>\n<td>backgroundColor</td>\n<td><code>string</code></td>\n<td><code>&quot;#fff&quot;</code></td>\n<td>二维码背景色</td>\n</tr>\n<tr>\n<td>foregroundColor</td>\n<td><code>string</code></td>\n<td><code>&quot;#000&quot;</code></td>\n<td>二维码前景色</td>\n</tr>\n<tr>\n<td>level</td>\n<td><code>string</code></td>\n<td><code>&quot;L&quot;</code></td>\n<td>二维码复杂级别，有（&#39;L&#39; &#39;M&#39; &#39;Q&#39; &#39;H&#39;）四种</td>\n</tr>\n<tr>\n<td>value</td>\n<td><code>string</code></td>\n<td><code>&quot;https://www.baidu.com&quot;</code></td>\n<td>扫描二维码后显示的文本，如果要显示某个页面请输入完整 url（<code>&quot;http://...&quot;</code>或<code>&quot;https://...&quot;</code>开头），支持使用 <code>${xxx}</code> 来获取变量</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"qr-code\",\n    \"codeSize\": 128,\n    \"backgroundColor\": \"#fff\",\n    \"foregroundColor\": \"#000\",\n    \"level\": \"L\",\n    \"value\": \"https://www.baidu.com\"\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "QRCode",
          "fragment": "qrcode",
          "fullPath": "#qrcode",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
