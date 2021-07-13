amis.define('docs/zh-CN/components/dropdown-button.md', function(require, exports, module, define) {

  module.exports = {
    "title": "DropDownButton",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "DropDownButton",
    "icon": null,
    "order": 44,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"dropdown-button\",\n        \"label\": \"下拉菜单\",\n        \"buttons\": [\n            {\n                \"type\": \"button\",\n                \"label\": \"按钮1\",\n                \"disabled\": true\n            },\n            {\n                \"type\": \"button\",\n                \"label\": \"按钮2\"\n            },\n            {\n                \"type\": \"button\",\n                \"label\": \"按钮3\"\n            }\n        ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>dropdown-button</code></td>\n<td>类型</td>\n</tr>\n<tr>\n<td>label</td>\n<td><code>string</code></td>\n<td></td>\n<td>按钮文本</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>block</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>块状样式</td>\n</tr>\n<tr>\n<td>size</td>\n<td><code>string</code></td>\n<td></td>\n<td>尺寸，支持<code>&#39;xs&#39;</code>、<code>&#39;sm&#39;</code>、<code>&#39;md&#39;</code> 、<code>&#39;lg&#39;</code></td>\n</tr>\n<tr>\n<td>align</td>\n<td><code>string</code></td>\n<td></td>\n<td>位置，可选<code>&#39;left&#39;</code>或<code>&#39;right&#39;</code></td>\n</tr>\n<tr>\n<td>buttons</td>\n<td><code>Array&lt;action&gt;</code></td>\n<td></td>\n<td>配置下拉按钮</td>\n</tr>\n<tr>\n<td>caretIcon</td>\n<td><code>string</code></td>\n<td></td>\n<td>caretIcon</td>\n</tr>\n<tr>\n<td>iconOnly</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>只显示 icon</td>\n</tr>\n<tr>\n<td>defaultIsOpened</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>默认是否打开</td>\n</tr>\n<tr>\n<td>closeOnOutside</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>点击外侧区域是否收起</td>\n</tr>\n</tbody></table>\n</div>",
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
