define('docs/renderers/SubForm.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"subform\" href=\"#subform\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>SubForm</h3><p>formItem 还可以是子表单类型。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>form</code></li>\n<li><code>multiple</code> 默认为 <code>false</code> 配置是否为多选模式</li>\n<li><code>labelField</code> 当值中存在这个字段，则按钮名称将使用此字段的值来展示。</li>\n<li><code>btnLabel</code> 按钮默认名称</li>\n<li><code>minLength</code> 限制最小长度。</li>\n<li><code>maxLength</code> 限制最大长度。</li>\n<li><code>addButtonClassName</code> 新增按钮 CSS 类名 默认：<code>btn-success btn-sm</code>。</li>\n<li><code>editButtonClassName</code> 修改按钮 CSS 类名 默认：<code>btn-info btn-addon btn-sm</code>。</li>\n<li><code>form</code> 字表单的配置\n<code>title</code> 标题\n<code>controls</code> 请参考 <a href=\"#/docs/renderers/Form\">Form</a> 中的配置说明。</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"form\">[\n{\n  \"type\": \"form\",\n  \"name\": \"form\",\n  \"label\": \"子Form\",\n  \"btnLabel\": \"设置子表单\",\n  \"form\": {\n    \"title\": \"配置子表单\",\n    \"controls\": [\n      {\n        \"name\": \"a\",\n        \"label\": \"A\",\n        \"type\": \"text\"\n      },\n\n      {\n        \"name\": \"b\",\n        \"label\": \"B\",\n        \"type\": \"text\"\n      }\n    ]\n  }\n},\n{\n  \"type\": \"static\",\n  \"name\": \"form\",\n  \"label\": \"当前值\"\n},\n{\n  \"type\": \"form\",\n  \"name\": \"form2\",\n  \"label\": \"多选\",\n  \"multiple\": true,\n  \"maxLength\":3,\n  \"btnLabel\": \"设置子表单\",\n  \"form\": {\n    \"title\": \"配置子表单\",\n    \"controls\": [\n      {\n        \"name\": \"a\",\n        \"label\": \"A\",\n        \"type\": \"text\"\n      },\n\n      {\n        \"name\": \"b\",\n        \"label\": \"B\",\n        \"type\": \"text\"\n      }\n    ]\n  }\n},\n{\n  \"type\": \"static\",\n  \"name\": \"form2\",\n  \"label\": \"当前值\"\n}\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "SubForm",
          "fragment": "subform",
          "fullPath": "#subform",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
