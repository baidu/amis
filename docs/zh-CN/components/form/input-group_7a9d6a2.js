amis.define('docs/zh-CN/components/form/input-group.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Input-Group 输入框组合",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Input-Group",
    "icon": null,
    "order": 28,
    "html": "<div class=\"markdown-body\"><p><strong>输入框组合选择器</strong> 可用于输入框与其他组件进行组合。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"body\": [\n    {\n      \"type\": \"input-group\",\n      \"name\": \"input-group\",\n      \"label\": \"input 组合\",\n      \"body\": [\n        {\n          \"type\": \"input-text\",\n          \"placeholder\": \"搜索作业ID/名称\",\n          \"inputClassName\": \"b-r-none p-r-none\",\n          \"name\": \"input-group\"\n        },\n        {\n          \"type\": \"submit\",\n          \"label\": \"搜索\",\n          \"level\": \"primary\"\n        }\n      ]\n    },\n    {\n      \"type\": \"input-group\",\n      \"label\": \"各种组合\",\n      \"body\": [\n        {\n          \"type\": \"select\",\n          \"name\": \"memoryUnits\",\n          \"options\": [\n            {\n              \"label\": \"Gi\",\n              \"value\": \"Gi\"\n            },\n            {\n              \"label\": \"Mi\",\n              \"value\": \"Mi\"\n            },\n            {\n              \"label\": \"Ki\",\n              \"value\": \"Ki\"\n            }\n          ],\n          \"value\": \"Gi\"\n        },\n        {\n          \"type\": \"input-text\",\n          \"name\": \"memory\"\n        },\n        {\n          \"type\": \"select\",\n          \"name\": \"memoryUnits2\",\n          \"options\": [\n            {\n              \"label\": \"Gi\",\n              \"value\": \"Gi\"\n            },\n            {\n              \"label\": \"Mi\",\n              \"value\": \"Mi\"\n            },\n            {\n              \"label\": \"Ki\",\n              \"value\": \"Ki\"\n            }\n          ],\n          \"value\": \"Gi\"\n        },\n        {\n          \"type\": \"button\",\n          \"label\": \"Go\"\n        }\n      ]\n    }\n  ]\n}\n\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%A0%A1%E9%AA%8C\" href=\"#%E6%A0%A1%E9%AA%8C\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>校验</h2><p>input-group 配置校验方法较为特殊，需要配置下面步骤：</p>\n<ol>\n<li>input-group 上配置任意<code>name</code>值</li>\n<li>input-group 的 body 内配置的表单项上配置校验规则</li>\n</ol>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>CSS 类名</td>\n</tr>\n<tr>\n<td>body</td>\n<td>Array&lt;<a href=\"./formitem\">表单项</a>&gt;</td>\n<td></td>\n<td>表单项集合</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "校验",
          "fragment": "%E6%A0%A1%E9%AA%8C",
          "fullPath": "#%E6%A0%A1%E9%AA%8C",
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
