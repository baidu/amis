amis.define('docs/components/form/editor.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Editor 编辑器",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Editor",
    "icon": null,
    "order": 19,
    "html": "<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"editor\",\n            \"name\": \"editor\",\n            \"label\": \"编辑器\"\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80\" href=\"#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>支持的语言</h2><p>可以设置<code>language</code>配置高亮的语言，支持的语言有：</p>\n<p><code>bat</code>、 <code>c</code>、 <code>coffeescript</code>、 <code>cpp</code>、 <code>csharp</code>、 <code>css</code>、 <code>dockerfile</code>、 <code>fsharp</code>、 <code>go</code>、 <code>handlebars</code>、 <code>html</code>、 <code>ini</code>、 <code>java</code>、 <code>javascript</code>、 <code>json</code>、 <code>less</code>、 <code>lua</code>、 <code>markdown</code>、 <code>msdax</code>、 <code>objective-c</code>、 <code>php</code>、 <code>plaintext</code>、 <code>postiats</code>、 <code>powershell</code>、 <code>pug</code>、 <code>python</code>、 <code>r</code>、 <code>razor</code>、 <code>ruby</code>、 <code>sb</code>、 <code>scss</code>、 <code>sol</code>、 <code>sql</code>、 <code>swift</code>、 <code>typescript</code>、 <code>vb</code>、 <code>xml</code>、 <code>yaml</code></p>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"editor\",\n            \"name\": \"editor\",\n            \"label\": \"JSON编辑器\",\n            \"language\": \"json\"\n        }\n    ]\n}\n</script></div>\n<p>当然你也可以使用<code>xxx-editor</code>这种形式，例如<code>&quot;type&quot;: &quot;json-editor&quot;</code></p>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"json-editor\",\n            \"name\": \"editor\",\n            \"label\": \"JSON编辑器\"\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>language</td>\n<td><code>string</code></td>\n<td><code>javascript</code></td>\n<td>编辑器高亮的语言</td>\n</tr>\n<tr>\n<td>size</td>\n<td><code>string</code></td>\n<td><code>md</code></td>\n<td>编辑器高度，取值可以是 <code>md</code>、<code>lg</code>、<code>xl</code>、<code>xxl</code></td>\n</tr>\n<tr>\n<td>options</td>\n<td><code>object</code></td>\n<td></td>\n<td>monaco 编辑器的其它配置，比如是否显示行号等，请参考<a href=\"https://microsoft.github.io/monaco-editor/api/enums/monaco.editor.editoroption.html\">这里</a>。</td>\n</tr>\n</tbody>\n</table>\n",
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
          "label": "支持的语言",
          "fragment": "%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80",
          "fullPath": "#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80",
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
