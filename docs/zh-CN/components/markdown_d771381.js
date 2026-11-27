amis.define('docs/zh-CN/components/markdown.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Markdown 渲染",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Markdown 渲染",
    "icon": null,
    "order": 58,
    "html": "<div class=\"markdown-body\"><blockquote>\n<p>1.1.6 版本开始</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"markdown\",\n        \"value\": \"# title\\n markdown **text**\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" href=\"#%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态数据</h2><p>动态数据可以通过 name 来关联，类似 <a href=\"form/static\">static</a> 组件</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E4%BA%8E-editor-%E5%92%8C%E6%95%B0%E6%8D%AE%E8%81%94%E5%8A%A8%E6%9D%A5%E5%AE%9E%E7%8E%B0%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD\" href=\"#%E5%9F%BA%E4%BA%8E-editor-%E5%92%8C%E6%95%B0%E6%8D%AE%E8%81%94%E5%8A%A8%E6%9D%A5%E5%AE%9E%E7%8E%B0%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基于 Editor 和数据联动来实现预览功能</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"group\",\n            \"body\": [\n                {\n                    \"type\": \"editor\",\n                    \"name\": \"md\",\n                    \"language\": \"markdown\"\n                },\n                {\n                    \"type\": \"markdown\",\n                    \"name\": \"md\"\n                }\n            ]\n        }\n\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8-markdown-%E6%96%87%E4%BB%B6\" href=\"#%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8-markdown-%E6%96%87%E4%BB%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>加载外部 markdown 文件</h2><blockquote>\n<p>1.6.5 及以上版本</p>\n</blockquote>\n<p>可以通过 <code>src</code> 属性来加载外部 markdown 文件，比如</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"markdown\",\n    \"src\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample/mirror?json=%7B%22status%22%3A0%2C%22data%22%3A%22%23%23%20title%20%5Cn%20content%22%7D\"\n}\n</script></div><div class=\"markdown-body\">\n<p>这个接口的返回格式可以是两种，一种是 JSON，类似</p>\n<pre><code>{\n    &quot;status&quot;: 0,\n    &quot;msg&quot;: &quot;&quot;,\n    &quot;data&quot;: &quot;markdown&quot;\n}\n</code></pre>\n<p>另一种是返回 <code>content-type</code> 为 <code>text/markdown</code> 或 <code>text/x-markdown</code> 的纯文本。</p>\n<h2><a class=\"anchor\" name=\"%E8%A7%86%E9%A2%91\" href=\"#%E8%A7%86%E9%A2%91\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>视频</h2><p>可以使用 <code>![text](video.mp4)</code> 语法来嵌入视频。</p>\n<h2><a class=\"anchor\" name=\"%E6%94%AF%E6%8C%81-latex\" href=\"#%E6%94%AF%E6%8C%81-latex\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>支持 latex</h2><blockquote>\n<p>3.6.0 及以上版本</p>\n</blockquote>\n<p>公式渲染使用 KaTeX 实现，由于体积太大默认不提供，需要自己去<a href=\"https://github.com/KaTeX/KaTeX/releases\">下载</a>，在页面中引入以下三个文件：</p>\n<pre><code>&lt;link rel=&quot;stylesheet&quot; href=&quot;katex/katex.min.css&quot;&gt;\n&lt;script src=&quot;katex/katex.min.js&quot;&gt;&lt;/script&gt;\n&lt;script src=&quot;katex/contrib/auto-render.min.js&quot;&gt;&lt;/script&gt;\n</code></pre>\n<p>markdown 中的 <code>$</code> 或 <code>$$</code> 包裹的内容就能以公式展现，比如 <code>$\\sqrt{a^2 + b^2}$</code>，如果是在代码中 <code>\\</code> 要转义为 <code>\\\\</code></p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"markdown\",\n        \"value\": \"$$\\\\hat{f} (\\\\xi)=\\\\int_{-\\\\infty}^{\\\\infty}f(x)e^{-2\\\\pi ix\\\\xi}dx$$\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE\" href=\"#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>高级配置</h2><blockquote>\n<p>1.8.1 及以上版本</p>\n</blockquote>\n<p>有以下配置：</p>\n<ul>\n<li>html，是否支持 html 标签，默认 false</li>\n<li>linkify，是否自动识别链接，默认值是 true</li>\n<li>breaks，是否回车就是换行，默认 false</li>\n</ul>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"markdown\",\n        \"value\": \"# title\\n <b>markdown</b>\\n http://www.github.com/\",\n        \"options\": {\n            linkify: false,\n            html: true,\n            breaks: true\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>name</td>\n<td><code>string</code></td>\n<td></td>\n<td>名称</td>\n</tr>\n<tr>\n<td>value</td>\n<td><code>string</code></td>\n<td></td>\n<td>静态值</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>类名</td>\n</tr>\n<tr>\n<td>src</td>\n<td><code>Api</code></td>\n<td></td>\n<td>外部地址</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "动态数据",
          "fragment": "%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "fullPath": "#%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "level": 2
        },
        {
          "label": "基于 Editor 和数据联动来实现预览功能",
          "fragment": "%E5%9F%BA%E4%BA%8E-editor-%E5%92%8C%E6%95%B0%E6%8D%AE%E8%81%94%E5%8A%A8%E6%9D%A5%E5%AE%9E%E7%8E%B0%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD",
          "fullPath": "#%E5%9F%BA%E4%BA%8E-editor-%E5%92%8C%E6%95%B0%E6%8D%AE%E8%81%94%E5%8A%A8%E6%9D%A5%E5%AE%9E%E7%8E%B0%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD",
          "level": 2
        },
        {
          "label": "加载外部 markdown 文件",
          "fragment": "%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8-markdown-%E6%96%87%E4%BB%B6",
          "fullPath": "#%E5%8A%A0%E8%BD%BD%E5%A4%96%E9%83%A8-markdown-%E6%96%87%E4%BB%B6",
          "level": 2
        },
        {
          "label": "视频",
          "fragment": "%E8%A7%86%E9%A2%91",
          "fullPath": "#%E8%A7%86%E9%A2%91",
          "level": 2
        },
        {
          "label": "支持 latex",
          "fragment": "%E6%94%AF%E6%8C%81-latex",
          "fullPath": "#%E6%94%AF%E6%8C%81-latex",
          "level": 2
        },
        {
          "label": "高级配置",
          "fragment": "%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE",
          "fullPath": "#%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE",
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
