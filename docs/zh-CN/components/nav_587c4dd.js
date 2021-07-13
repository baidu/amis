amis.define('docs/zh-CN/components/nav.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Nav 导航",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Nav",
    "icon": null,
    "order": 58,
    "html": "<div class=\"markdown-body\"><p>用于展示链接导航</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"nav\",\n    \"stacked\": true,\n    \"className\": \"w-md\",\n    \"links\": [\n        {\n            \"label\": \"Nav 1\",\n            \"to\": \"/docs/index\",\n            \"icon\": \"https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg\",\n            \"active\": true\n        },\n        {\n            \"label\": \"Nav 2\",\n            \"to\": \"/docs/api\"\n        },\n        {\n            \"label\": \"Nav 3\",\n            \"to\": \"/docs/renderers\"\n        },\n        {\n            \"label\": \"外部地址\",\n            \"to\": \"http://www.baidu.com/\",\n            \"target\": \"_blank\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E5%A4%9A%E5%B1%82%E7%BA%A7\" href=\"#%E9%85%8D%E7%BD%AE%E5%A4%9A%E5%B1%82%E7%BA%A7\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置多层级</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"nav\",\n    \"stacked\": true,\n    \"className\": \"w-md\",\n    \"links\": [\n        {\n            \"label\": \"Nav 1\",\n            \"to\": \"/docs/index\",\n            \"icon\": \"fa fa-user\",\n            \"active\": true\n        },\n        {\n            \"label\": \"Nav 2\",\n            \"unfolded\": true,\n            \"children\": [\n                {\n                    \"label\": \"Nav 2-1\",\n                    \"children\": [\n                        {\n                            \"label\": \"Nav 2-1-1\",\n                            \"to\": \"/docs/api-2-1-1\"\n                        }\n                    ]\n                },\n                {\n                    \"label\": \"Nav 2-2\",\n                    \"to\": \"/docs/api-2-2\"\n                }\n            ]\n        },\n        {\n            \"label\": \"Nav 3\",\n            \"to\": \"/docs/renderers\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%A8%AA%E5%90%91%E6%91%86%E6%94%BE\" href=\"#%E6%A8%AA%E5%90%91%E6%91%86%E6%94%BE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>横向摆放</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"nav\",\n    \"stacked\": false,\n    \"links\": [\n        {\n            \"label\": \"Nav 1\",\n            \"to\": \"/docs/index\",\n            \"icon\": \"fa fa-user\"\n        },\n        {\n            \"label\": \"Nav 2\",\n            \"to\": \"/docs/api\"\n        },\n        {\n            \"label\": \"Nav 3\",\n            \"to\": \"/docs/renderers\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%87%92%E5%8A%A0%E8%BD%BD\" href=\"#%E6%87%92%E5%8A%A0%E8%BD%BD\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>懒加载</h2><p>可以一次只加载部分层级，更深层次的选项可以标记为 <code>defer</code> 为 true，这样只有点开的时才会加载。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"nav\",\n    \"stacked\": true,\n    \"source\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/options/nav?parentId=${value}\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;nav&quot;</code></td>\n<td>指定为 Nav 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>stacked</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>设置成 false 可以以 tabs 的形式展示</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code> 或 <a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>可以通过变量或 API 接口动态创建导航</td>\n</tr>\n<tr>\n<td>deferApi</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>用来延时加载选项详情的接口，可以不配置，不配置公用 source 接口。</td>\n</tr>\n<tr>\n<td>links</td>\n<td><code>Array</code></td>\n<td></td>\n<td>链接集合</td>\n</tr>\n<tr>\n<td>links[x].label</td>\n<td><code>string</code></td>\n<td></td>\n<td>名称</td>\n</tr>\n<tr>\n<td>links[x].to</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>链接地址</td>\n</tr>\n<tr>\n<td>links[x].target</td>\n<td><code>string</code></td>\n<td>链接关系</td>\n<td></td>\n</tr>\n<tr>\n<td>links[x].icon</td>\n<td><code>string</code></td>\n<td></td>\n<td>图标</td>\n</tr>\n<tr>\n<td>links[x].children</td>\n<td><code>Array&lt;link&gt;</code></td>\n<td></td>\n<td>子链接</td>\n</tr>\n<tr>\n<td>links[x].unfolded</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>初始是否展开</td>\n</tr>\n<tr>\n<td>links[x].active</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否高亮</td>\n</tr>\n<tr>\n<td>links[x].activeOn</td>\n<td><a href=\"../../docs/concepts/expression\">表达式</a></td>\n<td></td>\n<td>是否高亮的条件，留空将自动分析链接地址</td>\n</tr>\n<tr>\n<td>links[x].defer</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>标记是否为懒加载项</td>\n</tr>\n<tr>\n<td>links[x].deferApi</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>可以不配置，如果配置优先级更高</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "配置多层级",
          "fragment": "%E9%85%8D%E7%BD%AE%E5%A4%9A%E5%B1%82%E7%BA%A7",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E5%A4%9A%E5%B1%82%E7%BA%A7",
          "level": 2
        },
        {
          "label": "横向摆放",
          "fragment": "%E6%A8%AA%E5%90%91%E6%91%86%E6%94%BE",
          "fullPath": "#%E6%A8%AA%E5%90%91%E6%91%86%E6%94%BE",
          "level": 2
        },
        {
          "label": "懒加载",
          "fragment": "%E6%87%92%E5%8A%A0%E8%BD%BD",
          "fullPath": "#%E6%87%92%E5%8A%A0%E8%BD%BD",
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
