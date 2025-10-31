amis.define('docs/zh-CN/components/code.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Code 代码高亮",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Code",
    "icon": null,
    "order": 38,
    "html": "<div class=\"markdown-body\"><p>使用代码高亮的方式来显示一段代码。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"code\",\n  \"language\": \"html\",\n  \"value\": \"<div>html</div>\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%AF%AD%E8%A8%80%E8%AE%BE%E7%BD%AE\" href=\"#%E8%AF%AD%E8%A8%80%E8%AE%BE%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>语言设置</h2><p>默认语言是 html，可以通过 language 指定以下语言：</p>\n<p><code>bat</code>、 <code>c</code>、 <code>coffeescript</code>、 <code>cpp</code>、 <code>csharp</code>、 <code>css</code>、 <code>dockerfile</code>、 <code>fsharp</code>、 <code>go</code>、 <code>handlebars</code>、 <code>html</code>、 <code>ini</code>、 <code>java</code>、 <code>javascript</code>、 <code>json</code>、 <code>less</code>、 <code>lua</code>、 <code>markdown</code>、 <code>msdax</code>、 <code>objective-c</code>、 <code>php</code>、 <code>plaintext</code>、 <code>postiats</code>、 <code>powershell</code>、 <code>pug</code>、 <code>python</code>、 <code>r</code>、 <code>razor</code>、 <code>ruby</code>、 <code>sb</code>、 <code>scss</code>、<code>shell</code>、 <code>sol</code>、 <code>sql</code>、 <code>swift</code>、 <code>typescript</code>、 <code>vb</code>、 <code>xml</code>、 <code>yaml</code></p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"body\": {\n    \"type\": \"code\",\n    \"language\": \"javascript\",\n    \"value\": \"(function () {\\n  let amis = amisRequire('amis/embed');\\n  let amisJSON = {\\n    type: 'page',\\n    title: '表单页面',\\n    body: {\\n      type: 'form',\\n      mode: 'horizontal',\\n      api: '/saveForm',\\n      body: [\\n        {\\n          label: 'Name',\\n          type: 'input-text',\\n          name: 'name'\\n        },\\n        {\\n          label: 'Email',\\n          type: 'input-email',\\n          name: 'email'\\n        }\\n      ]\\n    }\\n  };\\n  let amisScoped = amis.embed('#root', amisJSON);\\n})();\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<p>language 支持从上下文获取数据</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"data\": {\n    \"lang\": \"javascript\"\n  },\n  \"body\": {\n    \"type\": \"code\",\n    \"language\": \"${lang}\",\n    \"value\": \"function amis() {\\n  console.log('amis');\\n}\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" href=\"#%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态数据</h2><p>可以使用 name 来从上下文来获取数据，比如</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"data\": {\n    \"sourcecode\": \"<div>html</div>\"\n  },\n  \"body\": {\n    \"type\": \"code\",\n    \"language\": \"html\",\n    \"name\": \"sourcecode\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<p>因此它还能放在表单、crud 中实现代码的展现。</p>\n<h2><a class=\"anchor\" name=\"%E4%B8%BB%E9%A2%98%E5%8F%8A-tab-%E5%A4%A7%E5%B0%8F\" href=\"#%E4%B8%BB%E9%A2%98%E5%8F%8A-tab-%E5%A4%A7%E5%B0%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>主题及 tab 大小</h2><p>通过 <code>editorTheme</code> 设置主题，<code>tagSize</code> 设置 tab 宽度</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"code\",\n  \"language\": \"javascript\",\n  \"tagSize\": 4,\n  \"value\": \"function amis() {\\n\\tconsole.log('amis');\\n}\"\n}\n\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%B6%85%E5%87%BA%E6%8D%A2%E8%A1%8C\" href=\"#%E8%B6%85%E5%87%BA%E6%8D%A2%E8%A1%8C\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>超出换行</h2><blockquote>\n<p>1.5.1 及以上版本</p>\n</blockquote>\n<p>通过 <code>wordWrap</code> 设置是否折行，默认是折行</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"code\",\n  \"language\": \"typescript\",\n  \"tagSize\": 4,\n  \"wordWrap\": false,\n  \"value\": \"function amis() {\\n\\tconsole.log('amis')\\tconsole.log('amis')\\tconsole.log('amis')\\tconsole.log('amis')\\tconsole.log('amis')\\tconsole.log('amis');\\n}\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%9C%80%E5%A4%A7%E9%AB%98%E5%BA%A6\" href=\"#%E6%9C%80%E5%A4%A7%E9%AB%98%E5%BA%A6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>最大高度</h2><p>通过配置 <code>maxHeight</code> 可以实现最大高度，超出滚动</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"body\": {\n    \"type\": \"code\",\n    \"language\": \"javascript\",\n    \"className\": \"b-a\",\n    \"maxHeight\": 200,\n    \"value\": \"(function () {\\n  let amis = amisRequire('amis/embed');\\n  let amisJSON = {\\n    type: 'page',\\n    title: '表单页面',\\n    body: {\\n      type: 'form',\\n      mode: 'horizontal',\\n      api: '/saveForm',\\n      body: [\\n        {\\n          label: 'Name',\\n          type: 'input-text',\\n          name: 'name'\\n        },\\n        {\\n          label: 'Email',\\n          type: 'input-email',\\n          name: 'email'\\n        }\\n      ]\\n    }\\n  };\\n  let amisScoped = amis.embed('#root', amisJSON);\\n})();\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%AD%E8%A8%80%E9%AB%98%E4%BA%AE\" href=\"#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%AD%E8%A8%80%E9%AB%98%E4%BA%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>自定义语言高亮</h2><p>还可以通过 <code>customLang</code> 参数来自定义高亮，详情参考<a href=\"../../../examples/code\">示例</a>。</p>\n<p><code>customLang</code> 中主要是 <code>tokens</code> 设置，这里是语言词法配置，它有 4 个配置项：</p>\n<ul>\n<li><code>name</code>：词法名称</li>\n<li><code>regex</code>：词法的正则匹配，注意因为是在字符串中，这里正则中如果遇到 <code>\\</code> 需要写成 <code>\\\\</code></li>\n<li><code>regexFlags</code>: 可选，正则的标志参数</li>\n<li><code>color</code>：颜色</li>\n<li><code>fontStyle</code>: 可选，字体样式，比如 <code>bold</code> 代表加粗</li>\n</ul>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>value</td>\n<td><code>string</code></td>\n<td></td>\n<td>显示的颜色值</td>\n</tr>\n<tr>\n<td>name</td>\n<td><code>string</code></td>\n<td></td>\n<td>在其他组件中，时，用作变量映射</td>\n</tr>\n<tr>\n<td>language</td>\n<td><code>string</code></td>\n<td></td>\n<td>所使用的高亮语言，默认是 plaintext</td>\n</tr>\n<tr>\n<td>tabSize</td>\n<td><code>number</code></td>\n<td>4</td>\n<td>默认 tab 大小</td>\n</tr>\n<tr>\n<td>editorTheme</td>\n<td><code>string</code></td>\n<td>&#39;vs&#39;</td>\n<td>主题，还有 &#39;vs-dark&#39;</td>\n</tr>\n<tr>\n<td>wordWrap</td>\n<td><code>string</code></td>\n<td><code>true</code></td>\n<td>是否折行</td>\n</tr>\n<tr>\n<td>maxHeight</td>\n<td><code>string</code>|<code>number</code></td>\n<td></td>\n<td>最大高度</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "语言设置",
          "fragment": "%E8%AF%AD%E8%A8%80%E8%AE%BE%E7%BD%AE",
          "fullPath": "#%E8%AF%AD%E8%A8%80%E8%AE%BE%E7%BD%AE",
          "level": 2
        },
        {
          "label": "动态数据",
          "fragment": "%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "fullPath": "#%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "level": 2
        },
        {
          "label": "主题及 tab 大小",
          "fragment": "%E4%B8%BB%E9%A2%98%E5%8F%8A-tab-%E5%A4%A7%E5%B0%8F",
          "fullPath": "#%E4%B8%BB%E9%A2%98%E5%8F%8A-tab-%E5%A4%A7%E5%B0%8F",
          "level": 2
        },
        {
          "label": "超出换行",
          "fragment": "%E8%B6%85%E5%87%BA%E6%8D%A2%E8%A1%8C",
          "fullPath": "#%E8%B6%85%E5%87%BA%E6%8D%A2%E8%A1%8C",
          "level": 2
        },
        {
          "label": "最大高度",
          "fragment": "%E6%9C%80%E5%A4%A7%E9%AB%98%E5%BA%A6",
          "fullPath": "#%E6%9C%80%E5%A4%A7%E9%AB%98%E5%BA%A6",
          "level": 2
        },
        {
          "label": "自定义语言高亮",
          "fragment": "%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%AD%E8%A8%80%E9%AB%98%E4%BA%AE",
          "fullPath": "#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%AD%E8%A8%80%E9%AB%98%E4%BA%AE",
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
