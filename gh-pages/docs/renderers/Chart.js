define('docs/renderers/Chart.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"chart\" href=\"#chart\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Chart</h3><p>图表渲染器，采用 echarts 渲染，配置格式跟 echarts 相同，配置文档<a href=\"http://echarts.baidu.com/option.html#title\">文档</a></p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;chart&quot;</code></td>\n<td>指定为 chart 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>body</td>\n<td><a href=\"#/docs/renderers/Types#container\">Container</a></td>\n<td></td>\n<td>内容容器</td>\n</tr>\n<tr>\n<td>api</td>\n<td><a href=\"#/docs/renderers/Types#Api\">api</a></td>\n<td></td>\n<td>配置项远程地址</td>\n</tr>\n<tr>\n<td>initFetch</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否默认拉取</td>\n</tr>\n<tr>\n<td>interval</td>\n<td><code>number</code></td>\n<td></td>\n<td>刷新时间(最低 3000)</td>\n</tr>\n<tr>\n<td>config</td>\n<td><code>object/string</code></td>\n<td></td>\n<td>设置 eschars 的配置项,当为<code>string</code>的时候可以设置 function 等配置项</td>\n</tr>\n<tr>\n<td>style</td>\n<td><code>object</code></td>\n<td></td>\n<td>设置根元素的 style</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"chart\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/chart/chart\",\n    \"interval\": 5000\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Chart",
          "fragment": "chart",
          "fullPath": "#chart",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
