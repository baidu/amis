define('docs/renderers/Card.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"card\" href=\"#card\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Card</h2><p>卡片的展示形式。</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;card&quot;</code></td>\n<td>指定为 Card 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-default&quot;</code></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>header</td>\n<td><code>Object</code></td>\n<td></td>\n<td>Card 头部内容设置</td>\n</tr>\n<tr>\n<td>header.className</td>\n<td><code>string</code></td>\n<td></td>\n<td>头部类名</td>\n</tr>\n<tr>\n<td>header.title</td>\n<td><code>string</code></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>header.subTitle</td>\n<td><code>string</code></td>\n<td></td>\n<td>副标题</td>\n</tr>\n<tr>\n<td>header.desc</td>\n<td><code>string</code></td>\n<td></td>\n<td>描述</td>\n</tr>\n<tr>\n<td>header.avatar</td>\n<td><code>string</code></td>\n<td></td>\n<td>图片</td>\n</tr>\n<tr>\n<td>header.highlight</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否点亮</td>\n</tr>\n<tr>\n<td>header.avatarClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;pull-left thumb avatar b-3x m-r&quot;</code></td>\n<td>图片类名</td>\n</tr>\n<tr>\n<td>body</td>\n<td><code>Array</code> 或者 <a href=\"#/docs/renderers/Field\">Field</a></td>\n<td></td>\n<td>内容容器，主要用来放置 <a href=\"#/docs/renderers/Field\">Field</a></td>\n</tr>\n<tr>\n<td>bodyClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;padder m-t-sm m-b-sm&quot;</code></td>\n<td>内容区域类名</td>\n</tr>\n<tr>\n<td>actions</td>\n<td>Array Of <a href=\"#/docs/renderers/Button\">Button</a></td>\n<td></td>\n<td>按钮区域</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"card\",\n    \"header\": {\n        \"title\": \"Title\",\n        \"subTitle\": \"Sub Title\",\n        \"description\": \"description\",\n        \"avatarClassName\": \"pull-left thumb-md avatar b-3x m-r\",\n        \"avatar\": \"raw:http://hiphotos.baidu.com/fex/%70%69%63/item/c9fcc3cec3fdfc03ccabb38edd3f8794a4c22630.jpg\"\n    },\n    \"body\": \"Body\",\n    \"actions\": [\n        {\n            \"type\": \"button\",\n            \"label\": \"Action 1\",\n            \"actionType\": \"dialog\",\n            \"dialog\": {\n              \"confirmMode\": false,\n              \"title\": \"提示\",\n              \"body\": \"对，你刚点击了！\"\n            }\n        },\n\n        {\n          \"type\": \"button\",\n          \"label\": \"Action 2\",\n          \"actionType\": \"dialog\",\n          \"dialog\": {\n            \"confirmMode\": false,\n            \"title\": \"提示\",\n            \"body\": \"对，你刚点击了！\"\n          }\n        }\n    ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Card",
          "fragment": "card",
          "fullPath": "#card",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
