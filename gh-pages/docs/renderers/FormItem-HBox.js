define('docs/renderers/FormItem-HBox.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"hbox-formitem-\" href=\"#hbox-formitem-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>HBox(FormItem)</h3><p>支持 form 内部再用 HBox 布局，实现左右排列。没错用 <a href=\"#/docs/renderers/Group\">Group</a> 也能实现，所以还是推荐用 <a href=\"#/docs/renderers/Group\">Group</a>。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>hbox</code></li>\n<li><code>columns</code> 数据，用来配置列内容。每个 column 又一个独立的渲染器。</li>\n<li><code>columns[x].columnClassName</code> 配置列的 <code>className</code>。</li>\n<li><code>columns[x].controls</code> 如果配置了表单集合，同时没有指定 type 类型，则优先展示表单集合。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form-item\">{\n  \"type\": \"hbox\",\n  \"columns\": [\n    {\n        \"columnClassName\": \"w-sm\",\n        \"controls\": [\n            {\n                \"name\": \"text\",\n                \"type\": \"text\",\n                \"label\": false,\n                \"placeholder\": \"Text\"\n            }\n        ]\n    },\n\n    {\n        \"type\": \"tpl\",\n         \"tpl\": \"其他类型的渲染器\"\n    }\n  ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "HBox(FormItem)",
          "fragment": "hbox-formitem-",
          "fullPath": "#hbox-formitem-",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
