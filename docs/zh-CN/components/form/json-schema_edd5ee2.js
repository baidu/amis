amis.define('docs/zh-CN/components/form/json-schema.md', function(require, exports, module, define) {

  module.exports = {
    "title": "JSONSchema",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "JSONSchema",
    "icon": null,
    "order": 61,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><blockquote>\n<p>1.10.0 及以上版本</p>\n</blockquote>\n<p>这个组件可以基于 JSON Schema 生成表单项，方便对接类似 OpenAPI/Swagger Specification 的接口规范，可基于接口定义自动生成 amis 表单项。</p>\n<blockquote>\n<p>此组件还在实验阶段，很多 json-schema 属性没有对应实现，使用前请先确认你要的功能满足了需求</p>\n</blockquote>\n<p>基于 json-schema 定义生成表单输入项。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    debug: true,\n    \"body\": [\n        {\n            \"type\": \"json-schema\",\n            \"name\": \"value\",\n            \"label\": \"字段值\",\n            \"schema\": {\n              type: 'object',\n              properties: {\n                id: {\n                  type: 'number',\n                  title: 'ID'\n                },\n                name: {\n                  type: 'string',\n                  title: '名称'\n                },\n                description: {\n                  type: 'string',\n                  title: '描述'\n                }\n              }\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%A4%8D%E6%9D%82-case\" href=\"#%E5%A4%8D%E6%9D%82-case\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>复杂 case</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    debug: true,\n    \"body\": [\n        {\n            \"type\": \"json-schema\",\n            \"name\": \"value\",\n            \"label\": \"字段值\",\n            \"schema\": {\n              type: 'object',\n              additionalProperties: false,\n              required: ['id', 'name'],\n              properties: {\n                id: {\n                  type: 'number',\n                  title: 'ID'\n                },\n                name: {\n                  type: 'string',\n                  title: '名称'\n                },\n                description: {\n                  type: 'string',\n                  title: '描述'\n                },\n                date: {\n                  type: 'object',\n                  title: '日期',\n                  additionalProperties: false,\n                  required: ['year', 'month', 'day'],\n                  properties: {\n                    year: {\n                      type: 'number',\n                      title: '年'\n                    },\n                    month: {\n                      type: 'number',\n                      title: '月'\n                    },\n                    day: {\n                      type: 'number',\n                      title: '日'\n                    }\n                  }\n                },\n                tag: {\n                  type: 'array',\n                  title: '个人标签',\n                  items: {\n                    type: 'string'\n                  },\n                  minContains: 2,\n                  maxContains: 10\n                }\n              }\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%BF%9C%E7%A8%8B%E8%8E%B7%E5%8F%96-schema\" href=\"#%E8%BF%9C%E7%A8%8B%E8%8E%B7%E5%8F%96-schema\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>远程获取 schema</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    debug: true,\n    \"body\": [\n        {\n            \"type\": \"json-schema\",\n            \"name\": \"value\",\n            \"label\": \"字段值\",\n            \"schema\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/json-schema\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>schema</td>\n<td><code>object</code> | <code>string</code></td>\n<td></td>\n<td>指定 json-schema</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "复杂 case",
          "fragment": "%E5%A4%8D%E6%9D%82-case",
          "fullPath": "#%E5%A4%8D%E6%9D%82-case",
          "level": 2
        },
        {
          "label": "远程获取 schema",
          "fragment": "%E8%BF%9C%E7%A8%8B%E8%8E%B7%E5%8F%96-schema",
          "fullPath": "#%E8%BF%9C%E7%A8%8B%E8%8E%B7%E5%8F%96-schema",
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
