amis.define('docs/zh-CN/concepts/template.md', function(require, exports, module, define) {

  module.exports = {
    "title": "模板",
    "description": null,
    "type": 0,
    "group": "💡 概念",
    "menuName": "模板",
    "icon": null,
    "order": 11,
    "html": "<div class=\"markdown-body\"><p>为了可以更加灵活渲染文本、数据结构，amis 借鉴其他模板引擎，实现了一套模板渲染功能。</p>\n<h2><a class=\"anchor\" name=\"%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2\" href=\"#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>模板字符串</h2><h3><a class=\"anchor\" name=\"%E6%99%AE%E9%80%9A%E6%96%87%E6%9C%AC\" href=\"#%E6%99%AE%E9%80%9A%E6%96%87%E6%9C%AC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>普通文本</h3><p>配置一段普通文本并输出</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"body\": \"Hello World!\" // 输出 Hello World!\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E6%96%87%E6%9C%AC%E4%B8%AD%E8%8E%B7%E5%8F%96%E5%8F%98%E9%87%8F\" href=\"#%E6%96%87%E6%9C%AC%E4%B8%AD%E8%8E%B7%E5%8F%96%E5%8F%98%E9%87%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>文本中获取变量</h3><p>可以支持在普通文本中，使用<strong>数据映射</strong>语法：<code>${xxx}</code> 获取数据域中变量的值，如下</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"data\": {\n    \"text\": \"World!\"\n  },\n  \"type\": \"page\",\n  \"body\": \"Hello ${text}\" // 输出 Hello World!\n}\n</script></div><div class=\"markdown-body\">\n<p>更多<code>${xxx}</code>语法相关介绍，移步 <a href=\"./data-mapping\">数据映射</a>。</p>\n<h3><a class=\"anchor\" name=\"%E6%B8%B2%E6%9F%93-html\" href=\"#%E6%B8%B2%E6%9F%93-html\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>渲染 html</h3><p>使用<strong>数据映射</strong>语法：<code>${xxx}</code> 获取数据域中变量的值，并渲染 HTML</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"data\": {\n    \"text\": \"World!\"\n  },\n  \"type\": \"page\",\n  \"body\": \"<h1>Hello</h1> <span>${text}</span>\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"javascript-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E\" href=\"#javascript-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>JavaScript 模板引擎</h2><p>amis 还支持用 JavaScript 模板引擎进行组织输出，内部采用 <a href=\"https://lodash.com/docs/4.17.15#template\">lodash template</a> 进行实现。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"data\": {\n        \"user\": \"no one\",\n        \"items\": [\n            \"A\",\n            \"B\",\n            \"C\"\n        ]\n    },\n    \"body\": [\n        {\n            \"type\": \"tpl\",\n            \"tpl\": \"User: <%= data.user %>\"\n        },\n        {\n            \"type\": \"divider\"\n        },\n        {\n            \"type\": \"tpl\",\n            \"tpl\": \"<% if (data.items && data.items.length) { %>Array: <% data.items.forEach(function(item) { %> <span class='label label-default'><%= item %></span> <% }); %><% } %>\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<blockquote>\n<p>注意到了吗？</p>\n<p>在 JavaScript 模板引擎中，我们获取数据域变量的方式是<code>data.xxx</code>，而不是之前的<code>${xxx}</code>，如果你熟悉 JavaScript 的话，这里模板引擎其实是将数据域，当做当前代码的数据作用域进行执行，因此需要使用<code>data.xxx</code>进行取值</p>\n<p>要注意使用模板的时候在不同的场景下要使用正确的取值方式。</p>\n</blockquote>\n<p>仔细看示例不难发现，语法跟 ejs 很像，<code>&lt;% 这里面是 js 语句 %&gt;</code>，所以只要会写 js，做页面渲染没有什么问题。另外以下是一些可用 js 方法。</p>\n<ul>\n<li><code>formatDate(value, format=&#39;LLL&#39;, inputFormat=&#39;&#39;)</code>格式化时间格式，关于 format 请前往 <a href=\"https://momentjs.com/docs/\">moment</a> 文档页面。</li>\n<li><code>formatTimeStamp(value, format=&#39;LLL&#39;)</code> 格式化时间戳为字符串。</li>\n<li><code>formatNumber(number)</code> 格式化数字格式，加上千分位。</li>\n<li><code>countDown(value)</code> 倒计时，显示离指定时间还剩下多少天，只支持时间戳。</li>\n</ul>\n<p>下面 filters 中的方法也可以使用如： <code>&lt;%= date(data.xxx, &#39;YYYY-MM-DD&#39;) %&gt;</code></p>\n<h2><a class=\"anchor\" name=\"%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9\" href=\"#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>注意事项</h2><h4><a class=\"anchor\" name=\"1-%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2-%E5%92%8C-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E-%E4%B8%8D%E5%8F%AF%E4%BB%A5%E4%BA%A4%E5%8F%89%E4%BD%BF%E7%94%A8\" href=\"#1-%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2-%E5%92%8C-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E-%E4%B8%8D%E5%8F%AF%E4%BB%A5%E4%BA%A4%E5%8F%89%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>1. 模板字符串 和 模板引擎 不可以交叉使用</h4><p>例如：</p>\n<pre><code class=\"language-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"tpl\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"tpl\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"${data.xxx === 'a'}\"</span> <span class=\"token comment\">//错误！</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "模板字符串",
          "fragment": "%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2",
          "fullPath": "#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2",
          "level": 2,
          "children": [
            {
              "label": "普通文本",
              "fragment": "%E6%99%AE%E9%80%9A%E6%96%87%E6%9C%AC",
              "fullPath": "#%E6%99%AE%E9%80%9A%E6%96%87%E6%9C%AC",
              "level": 3
            },
            {
              "label": "文本中获取变量",
              "fragment": "%E6%96%87%E6%9C%AC%E4%B8%AD%E8%8E%B7%E5%8F%96%E5%8F%98%E9%87%8F",
              "fullPath": "#%E6%96%87%E6%9C%AC%E4%B8%AD%E8%8E%B7%E5%8F%96%E5%8F%98%E9%87%8F",
              "level": 3
            },
            {
              "label": "渲染 html",
              "fragment": "%E6%B8%B2%E6%9F%93-html",
              "fullPath": "#%E6%B8%B2%E6%9F%93-html",
              "level": 3
            }
          ]
        },
        {
          "label": "JavaScript 模板引擎",
          "fragment": "javascript-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E",
          "fullPath": "#javascript-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E",
          "level": 2
        },
        {
          "label": "注意事项",
          "fragment": "%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9",
          "fullPath": "#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9",
          "level": 2,
          "children": [
            {
              "label": "1. 模板字符串 和 模板引擎 不可以交叉使用",
              "fragment": "1-%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2-%E5%92%8C-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E-%E4%B8%8D%E5%8F%AF%E4%BB%A5%E4%BA%A4%E5%8F%89%E4%BD%BF%E7%94%A8",
              "fullPath": "#1-%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2-%E5%92%8C-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E-%E4%B8%8D%E5%8F%AF%E4%BB%A5%E4%BA%A4%E5%8F%89%E4%BD%BF%E7%94%A8",
              "level": 4
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
