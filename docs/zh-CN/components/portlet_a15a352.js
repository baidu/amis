amis.define('docs/zh-CN/components/portlet.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Portlet 门户栏目",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Portlet",
    "icon": null,
    "order": 60,
    "html": "<div class=\"markdown-body\"><p>门户栏目组件。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"data\": {\n        \"text\": \"这是一段描述信息\"\n    },\n    \"body\": {\n        \"type\": \"portlet\",\n        \"description\": \"${text}\",\n        \"tabs\": [\n            {\n                \"title\": \"标题\",\n                \"tab\": \"Content 1\"\n            },\n            {\n                \"title\": \"标题2\",\n                \"tab\": \"Content 2\"\n            }\n        ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E5%B7%A5%E5%85%B7%E6%A0%8F\" href=\"#%E9%85%8D%E7%BD%AE%E5%B7%A5%E5%85%B7%E6%A0%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置工具栏</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"portlet\",\n    \"toolbar\": [\n        {\n            \"label\": \"固定操作\",\n            \"type\": \"button\",\n            \"actionType\": \"ajax\",\n            \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\"\n        }\n    ],\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\",\n            \"toolbar\": [\n                {\n                    \"label\": \"ajax请求\",\n                    \"type\": \"button\",\n                    \"actionType\": \"ajax\",\n                    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\"\n                },\n                {\n                    \"type\": \"dropdown-button\",\n                    \"level\": \"link\",\n                    \"icon\": \"fa fa-ellipsis-h\",\n                    \"hideCaret\": true,\n                    \"buttons\": [\n                        {\n                            \"type\": \"button\",\n                            \"label\": \"编辑\",\n                            \"actionType\": \"dialog\",\n                            \"dialog\": {\n                            \"title\": \"编辑\",\n                            \"body\": \"你正在编辑该卡片\"\n                            }\n                        },\n                        {\n                            \"type\": \"button\",\n                            \"label\": \"删除\",\n                            \"actionType\": \"dialog\",\n                            \"dialog\": {\n                            \"title\": \"提示\",\n                            \"body\": \"你删掉了该卡片\"\n                            }\n                        }\n                    ]\n                }\n            ]\n        },\n        {\n            \"title\": \"Tab 2\",\n            \"tab\": \"Content 2\",\n            \"toolbar\": [\n                {\n                    \"type\": \"button\",\n                    \"level\": \"link\",\n                    \"url\": \"https://www.baidu.com\",\n                    \"actionType\": \"url\",\n                    \"size\": \"sm\",\n                    \"label\": \"跳转2\"\n                }\n            ]\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8\" href=\"#%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>隐藏头部</h2><p>去掉头部，默认只展示内容 tab 第一项的内容</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"portlet\",\n    \"hideHeader\": true,\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%AE%BE%E7%BD%AE-style\" href=\"#%E8%AE%BE%E7%BD%AE-style\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>设置 style</h2><p>默认 tabs 只有一项的时候没有选中状态</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"portlet\",\n    \"style\": {\n        \"borderColor\": '#333'\n    },\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8E%BB%E6%8E%89%E5%88%86%E9%9A%94%E7%BA%BF\" href=\"#%E5%8E%BB%E6%8E%89%E5%88%86%E9%9A%94%E7%BA%BF\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>去掉分隔线</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"portlet\",\n    \"divider\": false,\n    \"tabs\": [\n        {\n            \"title\": \"标题\",\n            \"tab\": \"Content 1\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"source-%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" href=\"#source-%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>source 动态数据</h2><p>配置 source 属性,根据某个数据来动态生成。具体使用参考 Tabs 选项卡组件</p>\n<h2><a class=\"anchor\" name=\"%E5%9B%BE%E6%A0%87\" href=\"#%E5%9B%BE%E6%A0%87\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>图标</h2><p>通过 icon 可以设置 tab 的图标，可以是 fontawesome 或 URL 地址。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"portlet\",\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\",\n            \"icon\": \"https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"mountonenter\" href=\"#mountonenter\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>mountOnEnter</h2><p>只有在点击卡片的时候才会渲染，在内容较多的时候可以提升性能，但第一次点击的时候会有卡顿。</p>\n<h2><a class=\"anchor\" name=\"unmountonexit\" href=\"#unmountonexit\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>unmountOnExit</h2><p>如果你想在切换 tab 时，自动销毁掉隐藏的 tab，请配置<code>&quot;unmountOnExit&quot;: true</code>。</p>\n<h2><a class=\"anchor\" name=\"%E7%9B%91%E5%90%AC%E5%88%87%E6%8D%A2%E4%BA%8B%E4%BB%B6\" href=\"#%E7%9B%91%E5%90%AC%E5%88%87%E6%8D%A2%E4%BA%8B%E4%BB%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>监听切换事件</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"portlet\",\n    \"activeKey\": 1,\n    \"onSelect\": \"alert(key)\",\n    \"tabs\": [\n      {\n        \"title\": \"Tab 1\",\n        \"tab\": \"Content 1\"\n      },\n      {\n        \"title\": \"Tab 2\",\n        \"tab\": \"Content 2\"\n      }\n    ]\n  }\n</script></div><div class=\"markdown-body\">\n<p>会传递 key 参数和 props</p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;portlet&quot;</code></td>\n<td>指定为 Portlet 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>tabsClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tabs Dom 的类名</td>\n</tr>\n<tr>\n<td>contentClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tabs content Dom 的类名</td>\n</tr>\n<tr>\n<td>tabs</td>\n<td><code>Array</code></td>\n<td></td>\n<td>tabs 内容</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>Object</code></td>\n<td></td>\n<td>tabs 关联数据，关联后可以重复生成选项卡</td>\n</tr>\n<tr>\n<td>toolbar</td>\n<td><a href=\"../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>tabs 中的工具栏，不随 tab 切换而变化</td>\n</tr>\n<tr>\n<td>style</td>\n<td><code>string | Object</code></td>\n<td></td>\n<td>自定义样式</td>\n</tr>\n<tr>\n<td>description</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>标题右侧信息</td>\n</tr>\n<tr>\n<td>hideHeader</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>隐藏头部</td>\n</tr>\n<tr>\n<td>divider</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>去掉分隔线</td>\n</tr>\n<tr>\n<td>tabs[x].title</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tab 标题</td>\n</tr>\n<tr>\n<td>tabs[x].icon</td>\n<td><code>icon</code></td>\n<td></td>\n<td>Tab 的图标</td>\n</tr>\n<tr>\n<td>tabs[x].tab</td>\n<td><a href=\"../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>内容区</td>\n</tr>\n<tr>\n<td>tabs[x].toolbar</td>\n<td><a href=\"../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>tabs 中的工具栏，随 tab 切换而变化</td>\n</tr>\n<tr>\n<td>tabs[x].reload</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用</td>\n</tr>\n<tr>\n<td>tabs[x].unmountOnExit</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>每次退出都会销毁当前 tab 栏内容</td>\n</tr>\n<tr>\n<td>tabs[x].className</td>\n<td><code>string</code></td>\n<td><code>&quot;bg-white b-l b-r b-b wrapper-md&quot;</code></td>\n<td>Tab 区域样式</td>\n</tr>\n<tr>\n<td>mountOnEnter</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>只有在点中 tab 的时候才渲染</td>\n</tr>\n<tr>\n<td>unmountOnExit</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>切换 tab 的时候销毁</td>\n</tr>\n<tr>\n<td>scrollable</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>是否导航支持内容溢出滚动，<code>vertical</code>和<code>chrome</code>模式下不支持该属性；<code>chrome</code>模式默认压缩标签</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "配置工具栏",
          "fragment": "%E9%85%8D%E7%BD%AE%E5%B7%A5%E5%85%B7%E6%A0%8F",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E5%B7%A5%E5%85%B7%E6%A0%8F",
          "level": 2
        },
        {
          "label": "隐藏头部",
          "fragment": "%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8",
          "fullPath": "#%E9%9A%90%E8%97%8F%E5%A4%B4%E9%83%A8",
          "level": 2
        },
        {
          "label": "设置 style",
          "fragment": "%E8%AE%BE%E7%BD%AE-style",
          "fullPath": "#%E8%AE%BE%E7%BD%AE-style",
          "level": 2
        },
        {
          "label": "去掉分隔线",
          "fragment": "%E5%8E%BB%E6%8E%89%E5%88%86%E9%9A%94%E7%BA%BF",
          "fullPath": "#%E5%8E%BB%E6%8E%89%E5%88%86%E9%9A%94%E7%BA%BF",
          "level": 2
        },
        {
          "label": "source 动态数据",
          "fragment": "source-%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "fullPath": "#source-%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "level": 2
        },
        {
          "label": "图标",
          "fragment": "%E5%9B%BE%E6%A0%87",
          "fullPath": "#%E5%9B%BE%E6%A0%87",
          "level": 2
        },
        {
          "label": "mountOnEnter",
          "fragment": "mountonenter",
          "fullPath": "#mountonenter",
          "level": 2
        },
        {
          "label": "unmountOnExit",
          "fragment": "unmountonexit",
          "fullPath": "#unmountonexit",
          "level": 2
        },
        {
          "label": "监听切换事件",
          "fragment": "%E7%9B%91%E5%90%AC%E5%88%87%E6%8D%A2%E4%BA%8B%E4%BB%B6",
          "fullPath": "#%E7%9B%91%E5%90%AC%E5%88%87%E6%8D%A2%E4%BA%8B%E4%BB%B6",
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
