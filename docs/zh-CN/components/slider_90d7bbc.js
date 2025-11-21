amis.define('docs/zh-CN/components/slider.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Slider 滑动条",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Tabs",
    "icon": null,
    "html": "<div class=\"markdown-body\"><p>主要用于移动端中支持左右滑动展示更多内容，在桌面端中更多内容展示在右侧</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"body\": {\n    \"type\": \"service\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/sample?perPage=5\",\n    \"body\": [\n      {\n        \"type\": \"list\",\n        \"source\": \"$rows\",\n        \"listItem\": {\n          \"body\": [\n            {\n              \"type\": \"slider\",\n              \"body\": [\n                {\n                  \"type\": \"container\",\n                  \"body\": {\n                    \"type\": \"tpl\",\n                    \"tpl\": \"Engine: ${engine}\"\n                  }\n                }\n              ],\n              \"left\":  [\n                {\n                  \"type\": \"button\",\n                  \"level\": \"primary\",\n                  \"label\": \"详情\",\n                  \"actionType\": \"dialog\",\n                  \"dialog\": {\n                    \"title\": \"查看详情\",\n                    \"body\": {\n                      \"type\": \"form\",\n                      \"body\": [\n                        {\n                          \"label\": \"Engine\",\n                          \"name\": \"engine\",\n                          \"type\": \"static\"\n                        },\n                        {\n                          \"name\": \"version\",\n                          \"label\": \"Version\",\n                          \"type\": \"static\"\n                        }\n                      ]\n                    }\n                  }\n                }\n              ],\n              \"right\":  [\n                {\n                  \"type\": \"button\",\n                  \"level\": \"danger\",\n                  \"label\": \"删除\"\n                }\n              ]\n            }\n          ]\n        }\n      }\n    ]\n  }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%BA%8B%E4%BB%B6%E8%A1%A8\" href=\"#%E4%BA%8B%E4%BB%B6%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>事件表</h2><blockquote>\n<p>2.6.1 及以上版本</p>\n</blockquote>\n<p>当前组件会对外派发以下事件，可以通过<code>onEvent</code>来监听这些事件，并通过<code>actions</code>来配置执行的动作，详细查看<a href=\"../../docs/concepts/event-action\">事件动作</a>。</p>\n<table>\n<thead>\n<tr>\n<th>事件名称</th>\n<th>事件参数</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>leftShow</td>\n<td><code>label: string</code> 鼠标事件对象</td>\n<td>左侧内容出现时触发</td>\n</tr>\n<tr>\n<td>leftHide</td>\n<td><code>label: string</code> 鼠标事件对象</td>\n<td>左侧内容隐藏时触发</td>\n</tr>\n<tr>\n<td>rightShow</td>\n<td><code>label: string</code> 鼠标事件对象</td>\n<td>右侧内容出现时触发</td>\n</tr>\n<tr>\n<td>rightHide</td>\n<td><code>label: string</code> 鼠标事件对象</td>\n<td>右侧内容隐藏时触发</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&#39;slider&#39;</code></td>\n<td>指定为滑动条渲染器</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>容器主要内容</td>\n</tr>\n<tr>\n<td>right</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>容器右侧内容，在 pc 下展示在右侧</td>\n</tr>\n<tr>\n<td>left</td>\n<td><a href=\"../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>容器左侧内容，在 pc 下展示在右侧</td>\n</tr>\n<tr>\n<td>bodyWidth</td>\n<td><code>string</code></td>\n<td><code>&#39;60%&#39;</code></td>\n<td>pc 下 body 即移动端默认宽度占比，默认 60%</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "事件表",
          "fragment": "%E4%BA%8B%E4%BB%B6%E8%A1%A8",
          "fullPath": "#%E4%BA%8B%E4%BB%B6%E8%A1%A8",
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
