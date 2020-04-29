define('docs/renderers/Wizard.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"wizard\" href=\"#wizard\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Wizard</h2><p>表单向导，能够配置多个步骤引导用户一步一步完成表单提交。</p>\n<ul>\n<li><code>type</code> 请设置 <code>wizard</code>。</li>\n<li><code>mode</code> 展示模式，请选择：<code>horizontal</code> 或者 <code>vertical</code>，默认为 <code>horizontal</code>。</li>\n<li><code>api</code> 最后一步保存的接口。</li>\n<li><code>initApi</code> 初始化数据接口。</li>\n<li><code>initFetch</code> 初始是否拉取数据。</li>\n<li><code>initFetchOn</code> 初始是否拉取数据，通过表达式来配置。</li>\n<li><code>actionPrevLabel</code> 上一步按钮名称，默认：<code>上一步</code>。</li>\n<li><code>actionNextLabel</code> 下一步按钮名称<code>下一步</code>。</li>\n<li><code>actionNextSaveLabel</code> 保存并下一步按钮名称，默认：<code>保存并下一步</code>。</li>\n<li><code>actionFinishLabel</code> 完成按钮名称，默认：<code>完成</code>。</li>\n<li><code>className</code> 外层 CSS 类名。</li>\n<li><code>actionClassName</code> 按钮 CSS 类名，默认：<code>btn-sm btn-default</code>。</li>\n<li><code>reload</code> 操作完后刷新目标对象。请填写目标组件设置的 name 值，如果填写为 <code>window</code> 则让当前页面整体刷新。</li>\n<li><code>redirect</code> 操作完后跳转。</li>\n<li><code>target</code> 可以把数据提交给别的组件而不是自己保存。请填写目标组件设置的 name 值，如果填写为 <code>window</code> 则把数据同步到地址栏上，同时依赖这些数据的组件会自动重新刷新。</li>\n<li><code>steps</code> 数组，配置步骤信息。</li>\n<li><code>steps[x].title</code> 步骤标题。</li>\n<li><code>steps[x].mode</code> 展示默认，跟 <a href=\"/amis/docs/renderers/Form/Form\">Form</a> 中的模式一样，选择： <code>normal</code>、<code>horizontal</code>或者<code>inline</code>。</li>\n<li><code>steps[x].horizontal</code> 当为水平模式时，用来控制左右占比。</li>\n<li><code>steps[x].horizontal.label</code> 左边 label 的宽度占比。</li>\n<li><code>steps[x].horizontal.right</code> 右边控制器的宽度占比。</li>\n<li><code>steps[x].horizontal.offset</code> 当没有设置 label 时，右边控制器的偏移量。</li>\n<li><code>steps[x].api</code> 当前步骤保存接口，可以不配置。</li>\n<li><code>steps[x].initApi</code> 当前步骤数据初始化接口。</li>\n<li><code>steps[x].initFetch</code> 当前步骤数据初始化接口是否初始拉取。</li>\n<li><code>steps[x].initFetchOn</code> 当前步骤数据初始化接口是否初始拉取，用表达式来决定。</li>\n<li><code>steps[x].controls</code> 当前步骤的表单项集合，请参考 <a href=\"/amis/docs/renderers/Form/FormItem\">FormItem</a>。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"wizard\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm?waitSeconds=2\",\n    \"mode\": \"vertical\",\n    \"steps\": [\n        {\n            \"title\": \"第一步\",\n            \"controls\": [\n                {\n                    \"name\": \"website\",\n                    \"label\": \"网址\",\n                    \"type\": \"url\",\n                    \"required\": true\n                },\n                {\n                    \"name\": \"email\",\n                    \"label\": \"邮箱\",\n                    \"type\": \"email\",\n                    \"required\": true\n                }\n            ]\n        },\n        {\n            \"title\": \"Step 2\",\n            \"controls\": [\n                {\n                    \"name\": \"email2\",\n                    \"label\": \"邮箱\",\n                    \"type\": \"email\",\n                    \"required\": true\n                }\n            ]\n        },\n        {\n            \"title\": \"Step 3\",\n            \"controls\": [\n                \"这是最后一步了\"\n            ]\n        }\n    ]\n}\n</script></div>\n<h3><a class=\"anchor\" name=\"%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E\" href=\"#%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>接口说明</h3><p>开始之前请你先阅读<a href=\"/amis/docs/api\">整体要求</a>。</p>\n<h4><a class=\"anchor\" name=\"initapi\" href=\"#initapi\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>initApi</h4><p>可以用来初始化表单数据。</p>\n<p><strong>发送</strong></p>\n<p>默认不携带任何参数，可以在上下文中取变量设置进去。</p>\n<p><strong>响应</strong></p>\n<p> 要求返回的数据 data 是对象，不要返回其他格式，且注意层级问题，data 中返回的数据正好跟 form 中的变量一一对应。</p>\n<pre><code> {\n   <span class=\"hljs-attribute\">status</span>: <span class=\"hljs-number\">0</span>,\n   msg: <span class=\"hljs-string\">''</span>,\n   data: {\n     a: <span class=\"hljs-string\">'123'</span>\n   }\n }\n</code></pre><p> 如果有个表单项的 name 配置成  a，initApi 返回后会自动填充 &#39;123&#39;。</p>\n<h4><a class=\"anchor\" name=\"api\" href=\"#api\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>api</h4><p> 用来保存表单结果。</p>\n<p> <strong>发送</strong></p>\n<p> 默认为 <code>POST</code> 方式，会将所有表单项整理成一个对象发送过过去。</p>\n<p> <strong>响应</strong></p>\n<p> 如果 返回了 data 对象，且是对象，会把结果 merge 到表单数据里面。</p>\n<h4><a class=\"anchor\" name=\"initasyncapi\" href=\"#initasyncapi\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>initAsyncApi</h4><p> 这个接口的作用在于解决接口耗时比较长导致超时问题的情况，当配置此接口后，初始化接口的时候先请求 initApi 如果 initApi 接口返回了 data.finished 为 true，则初始化完成。如果返回为 false 则之后每隔 3s 请求 initAsyncApi，直到接口返回了 data.finished 为 true 才结束。 用这种机制的话，业务 api 不需要完全等待操作完成才输出结果，而是直接检测状态，没完成也直接返回，后续还会发起请求检测。</p>\n<p> 格式要求就是 data 是对象，且 有 finished 这个字段。返回的其他字段会被 merge 到表单数据里面。</p>\n<h5><a class=\"anchor\" name=\"asyncapi\" href=\"#asyncapi\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>asyncApi</h5><p> 保存同样也可以采用异步模式，具体请参考 initAsyncApi。</p>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/Wizard.md\">/docs/renderers/Wizard.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Wizard",
          "fragment": "wizard",
          "fullPath": "#wizard",
          "level": 2,
          "children": [
            {
              "label": "接口说明",
              "fragment": "%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E",
              "fullPath": "#%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E",
              "level": 3,
              "children": [
                {
                  "label": "initApi",
                  "fragment": "initapi",
                  "fullPath": "#initapi",
                  "level": 4
                },
                {
                  "label": "api",
                  "fragment": "api",
                  "fullPath": "#api",
                  "level": 4
                },
                {
                  "label": "initAsyncApi",
                  "fragment": "initasyncapi",
                  "fullPath": "#initasyncapi",
                  "level": 4
                }
              ]
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
