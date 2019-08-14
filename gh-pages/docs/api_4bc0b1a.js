define('docs/api.md', function(require, exports, module) {

  module.exports = {
    "title": "API 说明",
    "html": "<p>amis 渲染器的数据都来源于 api，有一定的格式要求。</p>\n<h3><a class=\"anchor\" name=\"%E6%95%B4%E4%BD%93%E8%A6%81%E6%B1%82\" href=\"#%E6%95%B4%E4%BD%93%E8%A6%81%E6%B1%82\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>整体要求</h3><p>要求每个接口都返回 <code>status</code> 字段用来表示成功还是失败，如果失败了，通过 <code>msg</code> 字段来说明失败原因。当然如果成功 <code>msg</code> 也可以用来设置提示信息。</p>\n<pre><code class=\"lang-json\">{\n    <span class=\"hljs-string\">\"status\"</span>: 0,  <span class=\"hljs-string\">//</span> 0 表示成功，非0 表示失败\n    <span class=\"hljs-string\">\"msg\"</span>: <span class=\"hljs-string\">\"\"</span>,    <span class=\"hljs-string\">//</span> 提示信息 包括失败和成功\n    <span class=\"hljs-string\">\"data\"</span>: {\n        <span class=\"hljs-string\">//</span> <span class=\"hljs-string\">...</span>\n        <span class=\"hljs-string\">//</span> 具体的数据\n    }\n}\n</code></pre>\n<p>如果你的系统有自己的规范，也没关系，fetcher 整体入口那加个适配器就行了如：</p>\n<pre><code class=\"lang-js\">{\n    fetcher: function(<span class=\"hljs-name\">api</span>) {\n\n        // 适配这种格式 {<span class=\"hljs-string\">\"code\"</span>: <span class=\"hljs-number\">0</span>, <span class=\"hljs-string\">\"message\"</span>: <span class=\"hljs-string\">\"\"</span>, <span class=\"hljs-string\">\"result\"</span>: {}}\n        return axios(<span class=\"hljs-name\">config</span>).then(<span class=\"hljs-name\">response</span> =&gt; {\n            let payload = {\n                status: response.data.code,\n                msg: response.data.message,\n                data: response.data.result\n            }<span class=\"hljs-comment\">;</span>\n\n            return {\n                ...response,\n                data: payload\n            }\n        })\n    }\n}\n</code></pre>\n<h3><a class=\"anchor\" name=\"%E5%85%B7%E4%BD%93%E8%A6%81%E6%B1%82\" href=\"#%E5%85%B7%E4%BD%93%E8%A6%81%E6%B1%82\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>具体要求</h3><p>每个渲染的接口返回都有自己的格式要求，主要体现在 data 字段内部，具体请参考每个渲染的接口说明。</p>\n<ul>\n<li><a href=\"/amis/docs/renderers/Page#接口说明\">Page</a></li>\n</ul>\n<p><code>TBD</code></p>\n<ul>\n<li><a href=\"/amis/docs/renderers/CRUD#接口说明\">CRUD</a></li>\n<li><a href=\"/amis/docs/renderers/Form#接口说明\">Form</a><ul>\n<li><a href=\"/amis/docs/renderers/Form/Select#接口说明\">Select</a></li>\n<li><a href=\"/amis/docs/renderers/Form/Checkboxes#接口说明\">Checkboxes</a></li>\n<li><a href=\"/amis/docs/renderers/Form/Radios#接口说明\">Radios</a></li>\n<li><a href=\"/amis/docs/renderers/Form/List#接口说明\">List</a></li>\n</ul>\n</li>\n<li><a href=\"/amis/docs/renderers/Wizard#接口说明\">Wizard</a></li>\n</ul>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/api.md\">/docs/api.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "整体要求",
          "fragment": "%E6%95%B4%E4%BD%93%E8%A6%81%E6%B1%82",
          "fullPath": "#%E6%95%B4%E4%BD%93%E8%A6%81%E6%B1%82",
          "level": 3
        },
        {
          "label": "具体要求",
          "fragment": "%E5%85%B7%E4%BD%93%E8%A6%81%E6%B1%82",
          "fullPath": "#%E5%85%B7%E4%BD%93%E8%A6%81%E6%B1%82",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
