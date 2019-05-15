define('docs/renderers/Group.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"group\" href=\"#group\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Group</h3><p>表单项集合中，默认都是一行一个，如果想要一行多个，请用 Group 包裹起来。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>group</code></li>\n<li><code>controls</code> 表单项集合。</li>\n<li><code>mode</code> 展示默认，跟 <a href=\"#/docs/renderers/Form\">Form</a> 中的模式一样，选择： <code>normal</code>、<code>horizontal</code>或者<code>inline</code>。</li>\n<li><code>horizontal</code> 当为水平模式时，用来控制左右占比。</li>\n<li><code>horizontal.label</code> 左边 label 的宽度占比。</li>\n<li><code>horizontal.right</code> 右边控制器的宽度占比。</li>\n<li><code>horizontal.offset</code> 当没有设置 label 时，右边控制器的偏移量。</li>\n<li><code>className</code> CSS 类名。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 560px\"><script type=\"text/schema\" height=\"560\" scope=\"body\">{\n  \"type\": \"form\",\n  \"name\": \"sample2\",\n  \"controls\": [\n    {\n      \"type\": \"text\",\n      \"name\": \"test\",\n      \"label\": \"Label\",\n      \"placeholder\": \"Placeholder\"\n    },\n\n    {\n      \"type\": \"divider\"\n    },\n\n    {\n      \"type\": \"group\",\n      \"controls\": [\n        {\n          \"type\": \"text\",\n          \"name\": \"test1\",\n          \"label\": \"Label\",\n          \"placeholder\": \"Placeholder\"\n        },\n\n        {\n          \"type\": \"text\",\n          \"name\": \"test2\",\n          \"label\": \"Label\",\n          \"placeholder\": \"Placeholder\"\n        }\n      ]\n    }\n  ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Group",
          "fragment": "group",
          "fullPath": "#group",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
