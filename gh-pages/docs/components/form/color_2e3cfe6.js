amis.define('docs/components/form/color.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Color 颜色选择器",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Color",
    "icon": null,
    "order": 11,
    "html": "<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"color\",\n            \"name\": \"color\",\n            \"label\": \"颜色\"\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E9%80%89%E6%8B%A9%E5%99%A8%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%80%BC\" href=\"#%E9%80%89%E6%8B%A9%E5%99%A8%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>选择器预设颜色值</h2><p>颜色选择器底部预设有会写可选的颜色值，默认为：<code>[&#39;#D0021B&#39;, &#39;#F5A623&#39;, &#39;#F8E71C&#39;, &#39;#8B572A&#39;, &#39;#7ED321&#39;, &#39;#417505&#39;, &#39;#BD10E0&#39;, &#39;#9013FE&#39;, &#39;#4A90E2&#39;, &#39;#50E3C2&#39;, &#39;#B8E986&#39;, &#39;#000000&#39;, &#39;#4A4A4A&#39;, &#39;#9B9B9B&#39;, &#39;#FFFFFF&#39;]</code></p>\n<p>你可以配置<code>presetColors</code>数组进行自定义。</p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>当做选择器表单项使用时，除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>format</td>\n<td><code>string</code></td>\n<td><code>hex</code></td>\n<td>请选择 <code>hex</code>、<code>hls</code>、<code>rgb</code>或者<code>rgba</code>。</td>\n</tr>\n<tr>\n<td>presetColors</td>\n<td><code>Array&lt;string&gt;</code></td>\n<td><a href=\"./color#%E9%80%89%E6%8B%A9%E5%99%A8%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%80%BC\">见选择器预设颜色值</a></td>\n<td>选择器底部的默认颜色，数组内为空则不显示默认颜色</td>\n</tr>\n<tr>\n<td>allowCustomColor</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>为<code>false</code>时只能选择颜色，使用 <code>presetColors</code> 设定颜色选择范围</td>\n</tr>\n<tr>\n<td>clearable</td>\n<td><code>boolean</code></td>\n<td><code>&quot;label&quot;</code></td>\n<td>是否显示清除按钮</td>\n</tr>\n<tr>\n<td>resetValue</td>\n<td><code>string</code></td>\n<td><code>&quot;&quot;</code></td>\n<td>清除后，表单项值调整成该值</td>\n</tr>\n</tbody>\n</table>\n",
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
          "label": "选择器预设颜色值",
          "fragment": "%E9%80%89%E6%8B%A9%E5%99%A8%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%80%BC",
          "fullPath": "#%E9%80%89%E6%8B%A9%E5%99%A8%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%80%BC",
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
