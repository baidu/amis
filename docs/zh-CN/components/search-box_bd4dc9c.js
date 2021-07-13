amis.define('docs/zh-CN/components/search-box.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Search Box 搜索框",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Search Box",
    "icon": null,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>用于展示一个简单搜索框，通常需要搭配其他组件使用。比如 page 配置 <code>initApi</code> 后，可以用来实现简单数据过滤查找，<code>name</code> keywords 会作为参数传递给 page 的 <code>initApi</code>。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"initApi\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData?keywords=${keywords}\",\n    \"body\": [\n      {\n        \"type\": \"search-box\",\n        \"name\": \"keywords\"\n      },\n\n      {\n        \"type\": \"tpl\",\n        \"tpl\": \"<p>关键字：${keywords}</p><p>返回结果：${&|json}</p>\"\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"mini-%E7%89%88%E6%9C%AC\" href=\"#mini-%E7%89%88%E6%9C%AC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>mini 版本</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"initApi\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData?keywords=${keywords}\",\n    \"body\": [\n      {\n        \"type\": \"search-box\",\n        \"name\": \"keywords\",\n        \"mini\": true\n      },\n\n      {\n        \"type\": \"tpl\",\n        \"tpl\": \"<p>关键字：${keywords}</p><p>返回结果：${&|json}</p>\"\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%B8%8E-crud-%E6%90%AD%E9%85%8D\" href=\"#%E4%B8%8E-crud-%E6%90%AD%E9%85%8D\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>与 CRUD 搭配</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"crud\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample\",\n    \"syncLocation\": false,\n    \"headerToolbar\": [\n      {\n        \"type\": \"search-box\",\n        \"name\": \"keywords\",\n        \"align\": \"right\",\n        \"placeholder\": \"关键字检索\"\n      }\n    ],\n    \"columns\": [\n        {\n            \"name\": \"id\",\n            \"label\": \"ID\"\n        },\n        {\n            \"name\": \"engine\",\n            \"label\": \"Rendering engine\"\n        },\n        {\n            \"name\": \"browser\",\n            \"label\": \"Browser\"\n        },\n        {\n            \"name\": \"platform\",\n            \"label\": \"Platform(s)\"\n        },\n        {\n            \"name\": \"version\",\n            \"label\": \"Engine version\"\n        },\n        {\n            \"name\": \"grade\",\n            \"label\": \"CSS grade\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%B8%8E-service-%E6%90%AD%E9%85%8D\" href=\"#%E4%B8%8E-service-%E6%90%AD%E9%85%8D\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>与 Service 搭配</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": [\n      {\n        \"type\": \"service\",\n        \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData?keywords=${keywords}\",\n        \"body\": [\n          {\n            \"type\": \"search-box\",\n            \"name\": \"keywords\"\n          },\n\n          {\n            \"type\": \"tpl\",\n            \"tpl\": \"<p>关键字：${keywords}</p><p>返回结果：${&|json}</p>\"\n          }\n        ]\n      }\n\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td><code>search-box</code></td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>mini</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否为 mini 模式</td>\n</tr>\n<tr>\n<td>searchImediately</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否立即搜索</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "mini 版本",
          "fragment": "mini-%E7%89%88%E6%9C%AC",
          "fullPath": "#mini-%E7%89%88%E6%9C%AC",
          "level": 2
        },
        {
          "label": "与 CRUD 搭配",
          "fragment": "%E4%B8%8E-crud-%E6%90%AD%E9%85%8D",
          "fullPath": "#%E4%B8%8E-crud-%E6%90%AD%E9%85%8D",
          "level": 2
        },
        {
          "label": "与 Service 搭配",
          "fragment": "%E4%B8%8E-service-%E6%90%AD%E9%85%8D",
          "fullPath": "#%E4%B8%8E-service-%E6%90%AD%E9%85%8D",
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
