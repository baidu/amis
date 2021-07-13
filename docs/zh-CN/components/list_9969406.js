amis.define('docs/zh-CN/components/list.md', function(require, exports, module, define) {

  module.exports = {
    "title": "List 列表",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "List",
    "icon": null,
    "order": 56,
    "html": "<div class=\"markdown-body\"><p>列表展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像<code>Service</code>这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过<code>source</code>属性，获取数据链中的数据，完成数据展示。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"service\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample?perPage=5\",\n  \"body\": [\n    {\n      \"type\": \"panel\",\n      \"title\": \"简单 List 示例\",\n      \"body\": {\n        \"type\": \"list\",\n        \"source\": \"$rows\",\n        \"listItem\": {\n          \"body\": [\n            {\n              \"type\": \"hbox\",\n              \"columns\": [\n                {\n                  \"label\": \"Engine\",\n                  \"name\": \"engine\"\n                },\n\n                {\n                  \"name\": \"version\",\n                  \"label\": \"Version\"\n                }\n              ]\n            }\n          ],\n          \"actions\": [\n            {\n              \"type\": \"button\",\n              \"level\": \"link\",\n              \"label\": \"查看详情\",\n              \"actionType\": \"dialog\",\n              \"dialog\": {\n                \"title\": \"查看详情\",\n                \"body\": {\n                  \"type\": \"form\",\n                  \"body\": [\n                    {\n                      \"label\": \"Engine\",\n                      \"name\": \"engine\",\n                      \"type\": \"static\"\n                    },\n                    {\n                      \"name\": \"version\",\n                      \"label\": \"Version\",\n                      \"type\": \"static\"\n                    }\n                  ]\n                }\n              }\n            }\n          ]\n        }\n      }\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>或者你也可以使用 CRUD 的 <a href=\"./crud#list-%E5%88%97%E8%A1%A8%E6%A8%A1%E5%BC%8F\">list 模式</a></p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td><code>&quot;list&quot;</code> 指定为列表展示。</td>\n</tr>\n<tr>\n<td>title</td>\n<td><code>string</code></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code></td>\n<td><code>${items}</code></td>\n<td>数据源, 获取当前数据域变量，支持<a href=\"../../docs/concepts/data-mapping\">数据映射</a></td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td>‘暂无数据’</td>\n<td>当没数据的时候的文字提示</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>headerClassName</td>\n<td><code>string</code></td>\n<td><code>amis-list-header</code></td>\n<td>顶部外层 CSS 类名</td>\n</tr>\n<tr>\n<td>footerClassName</td>\n<td><code>string</code></td>\n<td><code>amis-list-footer</code></td>\n<td>底部外层 CSS 类名</td>\n</tr>\n<tr>\n<td>listItem</td>\n<td><code>Array</code></td>\n<td></td>\n<td>配置单条信息</td>\n</tr>\n<tr>\n<td>listItem.title</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>listItem.titleClassName</td>\n<td><code>string</code></td>\n<td><code>h5</code></td>\n<td>标题 CSS 类名</td>\n</tr>\n<tr>\n<td>listItem.subTitle</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>副标题</td>\n</tr>\n<tr>\n<td>listItem.avatar</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>图片地址</td>\n</tr>\n<tr>\n<td>listItem.avatarClassName</td>\n<td><code>string</code></td>\n<td><code>thumb-sm avatar m-r</code></td>\n<td>图片 CSS 类名</td>\n</tr>\n<tr>\n<td>listItem.desc</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>描述</td>\n</tr>\n<tr>\n<td>listItem.body</td>\n<td><code>Array</code></td>\n<td></td>\n<td>内容容器，主要用来放置非表单项组件</td>\n</tr>\n<tr>\n<td>listItem.actions</td>\n<td>Array&lt;<a href=\"./action\">Action</a>&gt;</td>\n<td></td>\n<td>按钮区域</td>\n</tr>\n<tr>\n<td>listItem.actionsPosition</td>\n<td>&#39;left&#39; or &#39;right&#39;</td>\n<td>默认在右侧</td>\n<td>按钮位置</td>\n</tr>\n</tbody></table>\n</div>",
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
