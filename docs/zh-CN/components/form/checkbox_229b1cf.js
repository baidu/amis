amis.define('docs/zh-CN/components/form/checkbox.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Checkbox 勾选框",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Checkbox",
    "icon": null,
    "order": 8,
    "html": "<div class=\"markdown-body\"><p>用于实现勾选，功能和 <a href=\"./switch\">Switch</a> 类似，只是展现上不同。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"body\": [\n        {\n            \"name\": \"checkbox\",\n            \"type\": \"checkbox\",\n            \"label\": \"勾选框\",\n            \"option\": \"选项说明\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E7%9C%9F%E5%81%87%E5%80%BC\" href=\"#%E9%85%8D%E7%BD%AE%E7%9C%9F%E5%81%87%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置真假值</h2><p>默认情况：</p>\n<ul>\n<li>勾选框勾选时，表单项值为：true</li>\n<li>勾选框取消勾选时，表单项值为：false</li>\n</ul>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"body\": [\n        {\n            \"name\": \"checkbox\",\n            \"type\": \"checkbox\",\n            \"label\": \"勾选框\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>如果你想调整这个值，可以配置<code>trueValue</code>和<code>falseValue</code></p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"body\": [\n        {\n            \"name\": \"checkbox\",\n            \"type\": \"checkbox\",\n            \"label\": \"勾选框\",\n            \"trueValue\": 1,\n            \"falseValue\": 0\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>勾选上例中的勾选框，观察数据域变化，会发现勾选后值为<code>1</code>，而取消勾选后为<code>0</code></p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明 ## 二级标题</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>option</td>\n<td><code>string</code></td>\n<td></td>\n<td>选项说明</td>\n</tr>\n<tr>\n<td>trueValue</td>\n<td><code>any</code></td>\n<td><code>true</code></td>\n<td>标识真值</td>\n</tr>\n<tr>\n<td>falseValue</td>\n<td><code>any</code></td>\n<td><code>&quot;false&quot;</code></td>\n<td>标识假值</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "配置真假值",
          "fragment": "%E9%85%8D%E7%BD%AE%E7%9C%9F%E5%81%87%E5%80%BC",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E7%9C%9F%E5%81%87%E5%80%BC",
          "level": 2
        },
        {
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
