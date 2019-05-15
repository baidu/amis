define('docs/renderers/Service.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"service\" href=\"#service\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Service</h2><p>功能型容器，自身不负责展示内容，主要职责在于通过配置的 api 拉取数据，数据可用于子组件。\n该组件初始化时就会自动拉取一次数据，后续如果需要刷新，请结合 Action 实现，可以把 Action 的 actionType 设置为 reload, target 为该组件的 name 值。\n同时该组件，还支持 api 数值自动监听，比如 <code>getData?type=$type</code> 只要当前环境 type 值发生变化，就会自动重新拉取。</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;service&quot;</code></td>\n<td>指定为 service 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"#/docs/renderers/Types#container\">Container</a></td>\n<td></td>\n<td>内容容器</td>\n</tr>\n<tr>\n<td>api</td>\n<td><a href=\"#/docs/renderers/Types#Api\">api</a></td>\n<td></td>\n<td>数据源 API 地址</td>\n</tr>\n<tr>\n<td>initFetch</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否默认拉取</td>\n</tr>\n<tr>\n<td>schemaApi</td>\n<td><a href=\"#/docs/renderers/Types#Api\">api</a></td>\n<td></td>\n<td>用来获取远程 Schema 的 api</td>\n</tr>\n<tr>\n<td>initFetchSchema</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否默认拉取 Schema</td>\n</tr>\n<tr>\n<td>interval</td>\n<td><code>number</code></td>\n<td><code>3000</code></td>\n<td>刷新时间(最低 3000)</td>\n</tr>\n<tr>\n<td>silentPolling</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>配置刷新时是否显示加载动画</td>\n</tr>\n<tr>\n<td>stopAutoRefreshWhen</td>\n<td><code>string</code></td>\n<td><code>&quot;&quot;</code></td>\n<td>通过<a href=\"#/docs/renderers/Types#表达式\">表达式</a>来配置停止刷新的条件</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"body\">{\n    \"type\": \"service\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/page/initData\",\n    \"body\": {\n        \"type\": \"panel\",\n        \"title\": \"$title\",\n        \"body\": \"现在是：${date}\"\n    }\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Service",
          "fragment": "service",
          "fullPath": "#service",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
