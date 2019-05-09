define('docs/renderers/FormItem-Service.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"service-formitem-\" href=\"#service-formitem-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Service(FormItem)</h3><p>目前看到的配置方式都是静态配置，如果你想动态配置，即配置项由接口决定，那么就使用此渲染器。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>service</code>。</li>\n<li><code>api</code> 数据接口</li>\n<li><code>initFetch</code> 初始是否拉取</li>\n<li><p><code>schemaApi</code> 配置接口，即由接口返回内容区的配置信息。\n正常期待返回是一个渲染器的配置如：</p>\n<pre><code class=\"lang-json\">{\n    <span class=\"hljs-attr\">\"type\"</span>: <span class=\"hljs-string\">\"tpl\"</span>,\n    <span class=\"hljs-attr\">\"tpl\"</span>: <span class=\"hljs-string\">\"这是内容。\"</span>\n}\n</code></pre>\n<p>但是，由于是在 form 里面，支持返回</p>\n<pre><code class=\"lang-json\">{\n    <span class=\"hljs-attr\">\"controls\"</span>: [\n        // 表单项配置\n    ]\n}\n</code></pre>\n</li>\n<li><p><code>initFetchSchema</code> 是否初始拉取配置接口。</p>\n</li>\n<li><code>name</code> 取个名字方便别的组件与之交互。比如某个按钮的 target 设置成次 name, 则会触发重新拉取。</li>\n<li><code>body</code> 内容容器，如果配置 schemaApi 则不需要配置，否则不配置的话，就没有内容展现。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"form\">[\n  {\n    \"name\": \"tpl\",\n    \"type\": \"select\",\n    \"label\": \"模板\",\n    \"inline\": true,\n    \"required\": true,\n    \"value\": \"tpl1\",\n    \"options\": [\n      {\n        \"label\": \"模板1\",\n        \"value\": \"tpl1\"\n      },\n      {\n        \"label\": \"模板2\",\n        \"value\": \"tpl2\"\n      },\n      {\n        \"label\": \"模板3\",\n        \"value\": \"tpl3\"\n      }\n    ]\n  },\n  {\n    \"type\": \"service\",\n    \"className\": \"m-t\",\n    \"initFetchSchemaOn\": \"data.tpl\",\n    \"schemaApi\": \"https://houtai.baidu.com/api/mock2/service/form?tpl=$tpl\"\n  }\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Service(FormItem)",
          "fragment": "service-formitem-",
          "fullPath": "#service-formitem-",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
