amis.define('docs/zh-CN/components/button.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Button 按钮",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Button 按钮",
    "icon": null,
    "order": 29,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"label\": \"弹个框\",\n  \"type\": \"button\",\n  \"actionType\": \"dialog\",\n  \"dialog\": {\n    \"title\": \"弹框\",\n    \"body\": \"这是个简单的弹框。\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<p><code>button</code> 实际上是 <code>action</code> 的别名，更多用法见 <a href=\"./action\">action</a></p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>指定添加 button 类名</td>\n</tr>\n<tr>\n<td>url</td>\n<td><code>string</code></td>\n<td></td>\n<td>点击跳转的地址，指定此属性 button 的行为和 a 链接一致</td>\n</tr>\n<tr>\n<td>size</td>\n<td><code>&#39;xs&#39; | &#39;sm&#39; | &#39;md&#39; | &#39;lg&#39; </code></td>\n<td></td>\n<td>设置按钮大小</td>\n</tr>\n<tr>\n<td>actionType</td>\n<td><code>&#39;button&#39; | &#39;reset&#39; | &#39;submit&#39;| &#39;clear&#39;| &#39;url&#39;</code></td>\n<td>button</td>\n<td>设置按钮类型</td>\n</tr>\n<tr>\n<td>level</td>\n<td><code>&#39;link&#39; | &#39;primary&#39; | &#39;enhance&#39; | &#39;secondary&#39; | &#39;info&#39;|&#39;success&#39; | &#39;warning&#39; | &#39;danger&#39; | &#39;light&#39;| &#39;dark&#39; | &#39;default&#39;</code></td>\n<td>default</td>\n<td>设置按钮样式</td>\n</tr>\n<tr>\n<td>tooltip</td>\n<td><code>&#39;string&#39; | &#39;TooltipObject&#39;</code></td>\n<td></td>\n<td>气泡提示内容</td>\n</tr>\n<tr>\n<td>tooltipPlacement</td>\n<td><code>&#39;top&#39; | &#39;right&#39; | &#39;bottom&#39; | &#39;left&#39; </code></td>\n<td>top</td>\n<td>气泡框位置器</td>\n</tr>\n<tr>\n<td>tooltipTrigger</td>\n<td><code>&#39;hover&#39; | &#39;focus&#39;</code></td>\n<td></td>\n<td>触发 tooltip</td>\n</tr>\n<tr>\n<td>disabled</td>\n<td><code>&#39;boolean&#39;</code></td>\n<td>false</td>\n<td>按钮失效状态</td>\n</tr>\n<tr>\n<td>disabledTip</td>\n<td><code>&#39;string&#39; | &#39;TooltipObject&#39;</code></td>\n<td></td>\n<td>按钮失效状态下的提示</td>\n</tr>\n<tr>\n<td>block</td>\n<td><code>&#39;boolean&#39;</code></td>\n<td>false</td>\n<td>将按钮宽度调整为其父宽度的选项</td>\n</tr>\n<tr>\n<td>loading</td>\n<td><code>&#39;boolean&#39;</code></td>\n<td>false</td>\n<td>显示按钮 loading 效果</td>\n</tr>\n<tr>\n<td>loadingOn</td>\n<td><code>&#39;string&#39;</code></td>\n<td></td>\n<td>显示按钮 loading 表达式</td>\n</tr>\n</tbody></table>\n</div>",
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
