define('docs/renderers/FormItem-Panel.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"panel-formitem-\" href=\"#panel-formitem-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Panel(FormItem)</h3><p>还是为了布局，可以把一部分 <a href=\"#/docs/renderers/FormItem\">FormItem</a> 合并到一个 panel 里面单独展示。</p>\n<ul>\n<li><code>title</code> panel 标题</li>\n<li><code>body</code> <a href=\"#/docs/renderers/Types#container\">Container</a> 可以是其他渲染模型。</li>\n<li><code>bodyClassName</code> body 的 className.</li>\n<li><code>footer</code> <a href=\"#/docs/renderers/Types#container\">Container</a> 可以是其他渲染模型。</li>\n<li><code>footerClassName</code> footer 的 className.</li>\n<li><code>controls</code> 跟 <code>body</code> 二选一，如果设置了 controls 优先显示表单集合。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"form-item\">{\n  \"type\": \"hbox\",\n  \"columns\": [\n    {\n      \"controls\": [\n        {\n          \"name\": \"text\",\n          \"type\": \"text\",\n          \"label\": false,\n          \"placeholder\": \"Text\"\n        }\n      ]\n    },\n\n    {\n      \"columnClassName\": \"w-xl\",\n      \"controls\": [\n        {\n          \"type\": \"panel\",\n          \"title\": \"bla bla\",\n          \"controls\": [\n            {\n              \"name\": \"text\",\n              \"type\": \"text\",\n              \"label\": false,\n              \"placeholder\": \"Text 1\"\n            },\n\n            {\n              \"name\": \"text2\",\n              \"type\": \"text\",\n              \"label\": false,\n              \"placeholder\": \"Text 2\"\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}\n\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Panel(FormItem)",
          "fragment": "panel-formitem-",
          "fullPath": "#panel-formitem-",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
