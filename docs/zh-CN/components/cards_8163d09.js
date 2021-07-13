amis.define('docs/zh-CN/components/cards.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Cards 卡片组",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Cards 卡片组",
    "icon": null,
    "order": 32,
    "html": "<div class=\"markdown-body\"><p>卡片展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像<code>Service</code>这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过<code>source</code>属性，获取数据链中的数据，完成数据展示。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>这里我们使用手动初始数据域的方式，即配置<code>data</code>属性，进行数据域的初始化。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"data\": {\n    \"items\": [\n      {\n        \"engine\": \"Trident\",\n        \"browser\": \"Internet Explorer 4.0\",\n        \"platform\": \"Win 95+\",\n        \"version\": \"4\",\n        \"grade\": \"X\"\n      },\n      {\n        \"engine\": \"Trident\",\n        \"browser\": \"Internet Explorer 5.0\",\n        \"platform\": \"Win 95+\",\n        \"version\": \"5\",\n        \"grade\": \"C\"\n      },\n      {\n        \"engine\": \"Trident\",\n        \"browser\": \"Internet Explorer 5.5\",\n        \"platform\": \"Win 95+\",\n        \"version\": \"5.5\",\n        \"grade\": \"A\"\n      },\n      {\n        \"engine\": \"Trident\",\n        \"browser\": \"Internet Explorer 6\",\n        \"platform\": \"Win 98+\",\n        \"version\": \"6\",\n        \"grade\": \"A\"\n      },\n      {\n        \"engine\": \"Trident\",\n        \"browser\": \"Internet Explorer 7\",\n        \"platform\": \"Win XP SP2+\",\n        \"version\": \"7\",\n        \"grade\": \"A\"\n      }\n    ]\n  },\n  \"body\": {\n    \"type\": \"cards\",\n    \"source\": \"$items\",\n    \"card\": {\n      \"body\": [\n        {\n          \"label\": \"Engine\",\n          \"name\": \"engine\"\n        },\n        {\n          \"label\": \"Browser\",\n          \"name\": \"browser\"\n        },\n        {\n          \"name\": \"version\",\n          \"label\": \"Version\"\n        }\n      ],\n      \"actions\": [\n        {\n          \"type\": \"button\",\n          \"level\": \"link\",\n          \"icon\": \"fa fa-eye\",\n          \"actionType\": \"dialog\",\n          \"dialog\": {\n            \"title\": \"查看详情\",\n            \"body\": {\n              \"type\": \"form\",\n              \"body\": [\n                {\n                  \"label\": \"Engine\",\n                  \"name\": \"engine\",\n                  \"type\": \"static\"\n                },\n\n                {\n                  \"name\": \"browser\",\n                  \"label\": \"Browser\",\n                  \"type\": \"static\"\n                },\n                {\n                  \"name\": \"version\",\n                  \"label\": \"Version\",\n                  \"type\": \"static\"\n                }\n              ]\n            }\n          }\n        }\n      ]\n    }\n  }\n}\n</script></div><div class=\"markdown-body\">\n<p>或者你也可以使用 CRUD 的 <a href=\"./crud#cards-%E5%8D%A1%E7%89%87%E6%A8%A1%E5%BC%8F\">card 模式</a></p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td><code>&quot;cards&quot;</code> 指定为卡片组。</td>\n</tr>\n<tr>\n<td>title</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>source</td>\n<td><a href=\"../../docs/concepts/data-mapping\">数据映射</a></td>\n<td><code>${items}</code></td>\n<td>数据源, 获取当前数据域中的变量</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td>‘暂无数据’</td>\n<td>当没数据的时候的文字提示</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>headerClassName</td>\n<td><code>string</code></td>\n<td><code>amis-grid-header</code></td>\n<td>顶部外层 CSS 类名</td>\n</tr>\n<tr>\n<td>footerClassName</td>\n<td><code>string</code></td>\n<td><code>amis-grid-footer</code></td>\n<td>底部外层 CSS 类名</td>\n</tr>\n<tr>\n<td>itemClassName</td>\n<td><code>string</code></td>\n<td><code>col-sm-4 col-md-3</code></td>\n<td>卡片 CSS 类名</td>\n</tr>\n<tr>\n<td>card</td>\n<td><a href=\"./card\">Card</a></td>\n<td></td>\n<td>配置卡片信息</td>\n</tr>\n</tbody></table>\n</div>",
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
