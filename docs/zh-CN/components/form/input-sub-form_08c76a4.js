amis.define('docs/zh-CN/components/form/input-sub-form.md', function(require, exports, module, define) {

  module.exports = {
    "title": "InputSubForm 子表单",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "InputSubForm 子表单",
    "icon": null,
    "order": 50,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"debug\": true,\n  \"body\": [\n      {\n        \"type\": \"input-sub-form\",\n        \"name\": \"form\",\n        \"label\": \"子Form\",\n        \"btnLabel\": \"设置子表单\",\n        \"form\": {\n          \"title\": \"配置子表单\",\n          \"body\": [\n            {\n              \"name\": \"a\",\n              \"label\": \"A\",\n              \"type\": \"input-text\"\n            },\n\n            {\n              \"name\": \"b\",\n              \"label\": \"B\",\n              \"type\": \"input-text\"\n            }\n          ]\n        }\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%A4%9A%E9%80%89%E6%A8%A1%E5%BC%8F\" href=\"#%E5%A4%9A%E9%80%89%E6%A8%A1%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>多选模式</h2><p>可以配置<code>&quot;multiple&quot;: true</code>，实现多选模式</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"debug\": true,\n  \"body\": [\n      {\n        \"type\": \"input-sub-form\",\n        \"name\": \"form2\",\n        \"label\": \"多选\",\n        \"multiple\": true,\n        \"maxLength\": 3,\n        \"form\": {\n          \"title\": \"配置子表单\",\n          \"body\": [\n            {\n              \"name\": \"a\",\n              \"label\": \"A\",\n              \"type\": \"input-text\"\n            },\n            {\n              \"name\": \"b\",\n              \"label\": \"B\",\n              \"type\": \"input-text\"\n            }\n          ]\n        }\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%AE%BE%E7%BD%AE%E6%8C%89%E9%92%AE%E5%90%8D%E7%A7%B0\" href=\"#%E8%AE%BE%E7%BD%AE%E6%8C%89%E9%92%AE%E5%90%8D%E7%A7%B0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>设置按钮名称</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"debug\": true,\n  \"body\": [\n      {\n        \"type\": \"input-sub-form\",\n        \"name\": \"form2\",\n        \"label\": \"多选\",\n        \"multiple\": true,\n        \"btnLabel\": \"设置${title}\",\n        \"form\": {\n          \"title\": \"配置子表单\",\n          \"body\": [\n            {\n              \"name\": \"title\",\n              \"label\": \"标题\",\n              \"required\": true,\n              \"type\": \"input-text\"\n            },\n            {\n              \"name\": \"b\",\n              \"label\": \"其他\",\n              \"type\": \"input-text\"\n            }\n          ]\n        }\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%94%AF%E6%8C%81%E6%8B%96%E6%8B%BD\" href=\"#%E6%94%AF%E6%8C%81%E6%8B%96%E6%8B%BD\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>支持拖拽</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"input-sub-form\",\n      \"name\": \"form2\",\n      \"label\": \"多选\",\n      \"multiple\": true,\n      \"btnLabel\": \"设置${title}\",\n      \"draggable\": true,\n      \"addable\": false,\n      \"removable\": false,\n      \"value\": [\n        {\n          \"title\": \"a\"\n        },\n        {\n          \"title\": \"b\"\n        },\n        {\n          \"title\": \"c\"\n        },\n        {\n          \"title\": \"d\"\n        }\n      ],\n      \"form\": {\n        \"title\": \"配置子表单\",\n        \"body\": [\n          {\n            \"name\": \"title\",\n            \"label\": \"标题\",\n            \"required\": true,\n            \"type\": \"input-text\"\n          },\n          {\n            \"name\": \"b\",\n            \"label\": \"其他\",\n            \"type\": \"input-text\"\n          }\n        ]\n      }\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>multiple</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否为多选模式</td>\n</tr>\n<tr>\n<td>labelField</td>\n<td><code>string</code></td>\n<td></td>\n<td>当值中存在这个字段，则按钮名称将使用此字段的值来展示。</td>\n</tr>\n<tr>\n<td>btnLabel</td>\n<td><code>string</code></td>\n<td><code>&quot;设置&quot;</code></td>\n<td>按钮默认名称</td>\n</tr>\n<tr>\n<td>minLength</td>\n<td><code>number</code></td>\n<td><code>0</code></td>\n<td>限制最小个数。</td>\n</tr>\n<tr>\n<td>maxLength</td>\n<td><code>number</code></td>\n<td><code>0</code></td>\n<td>限制最大个数。</td>\n</tr>\n<tr>\n<td>draggable</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否可拖拽排序</td>\n</tr>\n<tr>\n<td>addable</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否可新增</td>\n</tr>\n<tr>\n<td>removable</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否可删除</td>\n</tr>\n<tr>\n<td>addButtonClassName</td>\n<td><code>string</code></td>\n<td>``</td>\n<td>新增按钮 CSS 类名</td>\n</tr>\n<tr>\n<td>itemClassName</td>\n<td><code>string</code></td>\n<td>``</td>\n<td>值元素 CSS 类名</td>\n</tr>\n<tr>\n<td>itemsClassName</td>\n<td><code>string</code></td>\n<td>``</td>\n<td>值包裹元素 CSS 类名</td>\n</tr>\n<tr>\n<td>form</td>\n<td><a href=\"./index\">Form</a></td>\n<td></td>\n<td>子表单配置，同 <a href=\"./index\">Form</a></td>\n</tr>\n<tr>\n<td>addButtonText</td>\n<td><code>string</code></td>\n<td>``</td>\n<td>自定义新增一项的文本</td>\n</tr>\n<tr>\n<td>showErrorMsg</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否在左下角显示报错信息</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "多选模式",
          "fragment": "%E5%A4%9A%E9%80%89%E6%A8%A1%E5%BC%8F",
          "fullPath": "#%E5%A4%9A%E9%80%89%E6%A8%A1%E5%BC%8F",
          "level": 2
        },
        {
          "label": "设置按钮名称",
          "fragment": "%E8%AE%BE%E7%BD%AE%E6%8C%89%E9%92%AE%E5%90%8D%E7%A7%B0",
          "fullPath": "#%E8%AE%BE%E7%BD%AE%E6%8C%89%E9%92%AE%E5%90%8D%E7%A7%B0",
          "level": 2
        },
        {
          "label": "支持拖拽",
          "fragment": "%E6%94%AF%E6%8C%81%E6%8B%96%E6%8B%BD",
          "fullPath": "#%E6%94%AF%E6%8C%81%E6%8B%96%E6%8B%BD",
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
