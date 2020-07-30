amis.define('docs/components/form/service.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Service 功能容器",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Service",
    "icon": null,
    "order": 49,
    "html": "<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"service\",\n            \"api\": \"https://houtai.baidu.com/api/mock2/page/initData\",\n            \"controls\": [\n                {\n                    \"type\": \"text\",\n                    \"label\": \"时间\",\n                    \"name\": \"date\"\n                }\n            ]\n        }\n    ]\n}\n</script></div>\n<p>上例中我们在<code>text</code>表单项外，嵌套一层 service，用于初始化该表单项</p>\n<blockquote>\n<p>一般初始化表单项是使用 form 的<code>initApi</code>配置，当你需要多个接口来初始化一个表单中的表单项时，可以考虑使用 service</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E4%BD%9C%E4%B8%BA-formitem-%E7%9A%84%E4%B8%8D%E5%90%8C%E7%82%B9\" href=\"#%E4%BD%9C%E4%B8%BA-formitem-%E7%9A%84%E4%B8%8D%E5%90%8C%E7%82%B9\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>作为 FormItem 的不同点</h2><p>除了支持非表单项时的<a href=\"../service\">Service</a>的功能以外。作为 FormItem 使用时最大的不同在于作为容器渲染器，他的孩子是优先用表单项还是非表单项。</p>\n<p>比如放置一个 <code>{type: &#39;text&#39;}</code>，是渲染一个文本输入框、还是一个文本展示？</p>\n<p>两种应该都存在可能，所以作为表单项的 Service, 有两种用法，当把孩子节点放在 <code>controls</code> 里面时输出表单项，如果放在 <code>body</code> 底下时输出非表单项。</p>\n<h3><a class=\"anchor\" name=\"%E6%94%BE%E5%9C%A8-body-%E5%B1%9E%E6%80%A7%E4%B8%8B-%E8%BE%93%E5%87%BA%E7%BA%AF%E5%B1%95%E7%A4%BA%E7%B1%BB%E7%BB%84%E4%BB%B6\" href=\"#%E6%94%BE%E5%9C%A8-body-%E5%B1%9E%E6%80%A7%E4%B8%8B-%E8%BE%93%E5%87%BA%E7%BA%AF%E5%B1%95%E7%A4%BA%E7%B1%BB%E7%BB%84%E4%BB%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>放在 body 属性下，输出纯展示类组件</h3><div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form-item\">{\n    \"type\": \"service\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/page/initData\",\n    \"body\": {\n        \"type\": \"text\",\n        \"text\": \"现在是：${date}\"\n    }\n}\n</script></div>\n<h3><a class=\"anchor\" name=\"%E6%94%BE%E5%9C%A8-controls-%E5%B1%9E%E6%80%A7%E4%B8%8B-%E8%BE%93%E5%87%BA%E8%A1%A8%E5%8D%95%E9%A1%B9\" href=\"#%E6%94%BE%E5%9C%A8-controls-%E5%B1%9E%E6%80%A7%E4%B8%8B-%E8%BE%93%E5%87%BA%E8%A1%A8%E5%8D%95%E9%A1%B9\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>放在 controls 属性下，输出表单项</h3><div class=\"amis-preview\" style=\"height: 700px\"><script type=\"text/schema\" height=\"700\" scope=\"form-item\">{\n    \"type\": \"service\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/page/initData\",\n    \"controls\": [\n      {\n          \"type\": \"text\",\n          \"label\": \"文本输入\",\n          \"name\": \"a\"\n      },\n\n      {\n        \"type\": \"date\",\n        \"label\": \"日期\",\n        \"name\": \"date\",\n        \"format\": \"YYYY-MM-DD\"\n      }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8\" href=\"#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>接口联动</h2><p>Service 中的<code>api</code>和<code>schemaApi</code>都支持<strong>接口联动</strong>。</p>\n<p>下面例子中，<code>数据模板</code>下拉框的值变化后，会触发 service 重新拉取 api 接口，从而更新数据源，变化表单项的值，更多用法查看 <a href=\"../../concepts/linkage#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8\">接口联动</a>。</p>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n  \"title\": \"\",\n  \"type\": \"form\",\n  \"api\": \"https://houtai.baidu.com/api/mock/saveForm?waitSeconds=1\",\n  \"mode\": \"horizontal\",\n  \"controls\": [\n    {\n      \"label\": \"数据模板\",\n      \"type\": \"select\",\n      \"name\": \"tpl\",\n      \"value\": \"tpl1\",\n      \"size\": \"sm\",\n      \"options\": [\n        {\n          \"label\": \"模板1\",\n          \"value\": \"tpl1\"\n        },\n        {\n          \"label\": \"模板2\",\n          \"value\": \"tpl2\"\n        },\n        {\n          \"label\": \"模板3\",\n          \"value\": \"tpl3\"\n        }\n      ],\n      \"description\": \"<span class=\\\"text-danger\\\">修改下拉选择器查看效果</span>\"\n    },\n    {\n      \"type\": \"service\",\n      \"api\": \"https://houtai.baidu.com/api/mock2/form/initData?tpl=${tpl}\",\n      \"controls\": [\n        {\n          \"label\": \"名称\",\n          \"type\": \"text\",\n          \"name\": \"name\"\n        },\n        {\n          \"label\": \"作者\",\n          \"type\": \"text\",\n          \"name\": \"author\"\n        },\n        {\n          \"label\": \"请求时间\",\n          \"type\": \"datetime\",\n          \"name\": \"date\"\n        }\n      ]\n    }\n  ],\n  \"actions\": []\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E6%B8%B2%E6%9F%93%E8%A1%A8%E5%8D%95%E9%A1%B9\" href=\"#%E5%8A%A8%E6%80%81%E6%B8%B2%E6%9F%93%E8%A1%A8%E5%8D%95%E9%A1%B9\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态渲染表单项</h2><p>默认 Service 可以通过配置<code>schemaApi</code> <a href=\"../service#%E5%8A%A8%E6%80%81%E6%B8%B2%E6%9F%93%E9%A1%B5%E9%9D%A2\">动态渲染页面内容</a>，但是如果想渲染表单项，请返回下面这种格式：</p>\n<pre><code class=\"lang-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"status\"</span><span class=\"token operator\">:</span> <span class=\"token number\">0</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"msg\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"data\"</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token property\">\"controls\"</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">[</span>\n      <span class=\"token punctuation\">{</span>\n        <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"text\"</span><span class=\"token punctuation\">,</span>\n        <span class=\"token property\">\"name\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"text\"</span><span class=\"token punctuation\">,</span>\n        <span class=\"token property\">\"label\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"文本输入\"</span>\n      <span class=\"token punctuation\">}</span>\n    <span class=\"token punctuation\">]</span>\n  <span class=\"token punctuation\">}</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<p>例如下例：</p>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"form-item\">{\n  \"type\": \"service\",\n  \"schemaApi\": \"https://houtai.baidu.com/api/mock2/service/schema?type=controls\"\n}\n</script></div>\n<p><code>schemaApi</code> 同样支持 <a href=\"\"></a></p>\n",
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
          "label": "作为 FormItem 的不同点",
          "fragment": "%E4%BD%9C%E4%B8%BA-formitem-%E7%9A%84%E4%B8%8D%E5%90%8C%E7%82%B9",
          "fullPath": "#%E4%BD%9C%E4%B8%BA-formitem-%E7%9A%84%E4%B8%8D%E5%90%8C%E7%82%B9",
          "level": 2,
          "children": [
            {
              "label": "放在 body 属性下，输出纯展示类组件",
              "fragment": "%E6%94%BE%E5%9C%A8-body-%E5%B1%9E%E6%80%A7%E4%B8%8B-%E8%BE%93%E5%87%BA%E7%BA%AF%E5%B1%95%E7%A4%BA%E7%B1%BB%E7%BB%84%E4%BB%B6",
              "fullPath": "#%E6%94%BE%E5%9C%A8-body-%E5%B1%9E%E6%80%A7%E4%B8%8B-%E8%BE%93%E5%87%BA%E7%BA%AF%E5%B1%95%E7%A4%BA%E7%B1%BB%E7%BB%84%E4%BB%B6",
              "level": 3
            },
            {
              "label": "放在 controls 属性下，输出表单项",
              "fragment": "%E6%94%BE%E5%9C%A8-controls-%E5%B1%9E%E6%80%A7%E4%B8%8B-%E8%BE%93%E5%87%BA%E8%A1%A8%E5%8D%95%E9%A1%B9",
              "fullPath": "#%E6%94%BE%E5%9C%A8-controls-%E5%B1%9E%E6%80%A7%E4%B8%8B-%E8%BE%93%E5%87%BA%E8%A1%A8%E5%8D%95%E9%A1%B9",
              "level": 3
            }
          ]
        },
        {
          "label": "接口联动",
          "fragment": "%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8",
          "fullPath": "#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8",
          "level": 2
        },
        {
          "label": "动态渲染表单项",
          "fragment": "%E5%8A%A8%E6%80%81%E6%B8%B2%E6%9F%93%E8%A1%A8%E5%8D%95%E9%A1%B9",
          "fullPath": "#%E5%8A%A8%E6%80%81%E6%B8%B2%E6%9F%93%E8%A1%A8%E5%8D%95%E9%A1%B9",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
