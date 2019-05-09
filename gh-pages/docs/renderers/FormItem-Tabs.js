define('docs/renderers/FormItem-Tabs.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"tabs-formitem-\" href=\"#tabs-formitem-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Tabs(FormItem)</h3><p>多个输入框也可以通过选项卡来分组。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>tabs</code></li>\n<li><code>tabs</code> 选项卡数组</li>\n<li><code>tabs[x].title</code> 标题</li>\n<li><code>tabs[x].controls</code> 表单项集合。</li>\n<li><code>tabs[x].body</code> 内容容器，跟 <code>controls</code> 二选一。</li>\n<li><code>tabClassName</code> 选项卡 CSS 类名。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 700px\"><script type=\"text/schema\" height=\"700\" scope=\"form-item\">{\n  \"type\": \"tabs\",\n  \"tabs\": [\n    {\n      \"title\": \"基本配置\",\n      \"controls\": [\n        {\n          \"name\": \"a\",\n          \"type\": \"text\",\n          \"label\": \"文本1\"\n        },\n\n        {\n          \"name\": \"a\",\n          \"type\": \"text\",\n          \"label\": \"文本2\"\n        }\n      ]\n    },\n\n    {\n      \"title\": \"其他配置\",\n      \"controls\": [\n        {\n          \"name\": \"c\",\n          \"type\": \"text\",\n          \"label\": \"文本3\"\n        },\n\n        {\n          \"name\": \"d\",\n          \"type\": \"text\",\n          \"label\": \"文本4\"\n        }\n      ]\n    }\n  ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Tabs(FormItem)",
          "fragment": "tabs-formitem-",
          "fullPath": "#tabs-formitem-",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
