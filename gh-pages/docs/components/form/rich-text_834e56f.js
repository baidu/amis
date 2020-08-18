amis.define('docs/components/form/rich-text.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Rich-Text 富文本编辑器",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Rich-Text",
    "icon": null,
    "order": 47,
    "html": "<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 800px\"><script type=\"text/schema\" height=\"800\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"rich-text\",\n            \"name\": \"rich\",\n            \"label\": \"Rich Text\"\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE-buttons\" href=\"#%E9%85%8D%E7%BD%AE-buttons\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置 buttons</h2><pre><code class=\"lang-js\"><span class=\"token punctuation\">[</span>\n  <span class=\"token string\">'paragraphFormat'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'quote'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'color'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'|'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'bold'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'italic'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'underline'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'strikeThrough'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'|'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'formatOL'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'formatUL'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'align'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'|'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'insertLink'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'insertImage'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'insertTable'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'|'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'undo'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'redo'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">'html'</span>\n<span class=\"token punctuation\">]</span><span class=\"token punctuation\">;</span>\n</code></pre>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>当做选择器表单项使用时，除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>saveAsUbb</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否保存为 ubb 格式</td>\n</tr>\n<tr>\n<td>reciever</td>\n<td><a href=\"../../types/api\">API</a></td>\n<td></td>\n<td>默认的图片保存 API</td>\n</tr>\n<tr>\n<td>size</td>\n<td><code>string</code></td>\n<td></td>\n<td>框的大小，可设置为 <code>md</code> 或者 <code>lg</code></td>\n</tr>\n<tr>\n<td>options</td>\n<td><code>object</code></td>\n<td></td>\n<td>Object 类型，给富文本的配置信息。请参考 <a href=\"https://www.froala.com/wysiwyg-editor/docs/options\">https://www.froala.com/wysiwyg-editor/docs/options</a></td>\n</tr>\n<tr>\n<td>buttons</td>\n<td><code>Array&lt;string&gt;</code></td>\n<td>`[ &#39;paragraphFormat&#39;, &#39;quote&#39;, &#39;color&#39;, &#39;</td>\n<td>&#39;, &#39;bold&#39;, &#39;italic&#39;, &#39;underline&#39;, &#39;strikeThrough&#39;, &#39;</td>\n<td>&#39;, &#39;formatOL&#39;, &#39;formatUL&#39;, &#39;align&#39;, &#39;</td>\n<td>&#39;, &#39;insertLink&#39;, &#39;insertImage&#39;, &#39;insertTable&#39;, &#39;</td>\n<td>&#39;, &#39;undo&#39;, &#39;redo&#39;, &#39;html&#39; ]`</td>\n<td>精度，即小数点后几位</td>\n</tr>\n</tbody>\n</table>\n",
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
          "label": "配置 buttons",
          "fragment": "%E9%85%8D%E7%BD%AE-buttons",
          "fullPath": "#%E9%85%8D%E7%BD%AE-buttons",
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
