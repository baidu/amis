amis.define('docs/zh-CN/components/amis.md', function(require, exports, module, define) {

  module.exports = {
    "title": "AMIS 渲染器",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "AMIS 渲染器",
    "icon": null,
    "order": 28,
    "html": "<div class=\"markdown-body\"><p>用于渲染数据中的 amis 配置</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2><p>只需要设置 schema 或 name，值可以是 JSON 对象或字符串的 JSON</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"amis\",\n  \"schema\": {\n    \"type\": \"tpl\",\n    \"tpl\": \"amis render\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%80%9A%E8%BF%87-name-%E7%BB%91%E5%AE%9A%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" href=\"#%E9%80%9A%E8%BF%87-name-%E7%BB%91%E5%AE%9A%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>通过 name 绑定动态数据</h2><p>可以用在表单或 CRUD 中，下面示例演示了编辑后实时渲染的效果，因为使用了相同 的 name</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"title\": \"实时测试 amis 渲染效果\",\n    \"body\": [\n        {\n            \"type\": \"group\",\n            \"body\": [\n                {\n                    \"type\": \"editor\",\n                    \"name\": \"amis\",\n                    \"language\": \"json\",\n                    \"value\": {\n                      \"label\": \"弹框\",\n                      \"type\": \"button\",\n                      \"actionType\": \"dialog\",\n                      \"dialog\": {\n                        \"title\": \"弹框\",\n                        \"body\": \"这是个简单的弹框。\"\n                      }\n                    }\n                },\n                {\n                    \"type\": \"amis\",\n                    \"name\": \"amis\"\n                }\n            ]\n        }\n\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%90%91%E4%B8%8B%E4%BC%A0%E9%80%92-props\" href=\"#%E5%90%91%E4%B8%8B%E4%BC%A0%E9%80%92-props\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>向下传递 props</h2><p>通过设置 props 向下传递，这个 props 会作为默认值</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"amis\",\n  \"props\": {\n    \"tpl\": \"amis render\"\n  },\n  \"value\": {\n    \"type\": \"tpl\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;amis&quot;</code></td>\n<td>指定为 amis 渲染器</td>\n</tr>\n<tr>\n<td>name</td>\n<td><code>string</code></td>\n<td></td>\n<td>绑定上下文变量名</td>\n</tr>\n<tr>\n<td>props</td>\n<td><code>object</code></td>\n<td></td>\n<td>向下传递的 props</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本使用",
          "fragment": "%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "level": 2
        },
        {
          "label": "通过 name 绑定动态数据",
          "fragment": "%E9%80%9A%E8%BF%87-name-%E7%BB%91%E5%AE%9A%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "fullPath": "#%E9%80%9A%E8%BF%87-name-%E7%BB%91%E5%AE%9A%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "level": 2
        },
        {
          "label": "向下传递 props",
          "fragment": "%E5%90%91%E4%B8%8B%E4%BC%A0%E9%80%92-props",
          "fullPath": "#%E5%90%91%E4%B8%8B%E4%BC%A0%E9%80%92-props",
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
