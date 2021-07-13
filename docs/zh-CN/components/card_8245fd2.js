amis.define('docs/zh-CN/components/card.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Card 卡片",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Card 卡片",
    "icon": null,
    "order": 31,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"card\",\n    \"header\": {\n        \"title\": \"标题\",\n        \"subTitle\": \"副标题\",\n        \"description\": \"这是一段描述\",\n        \"avatarClassName\": \"pull-left thumb-md avatar b-3x m-r\",\n        \"avatar\": \"raw:http://hiphotos.baidu.com/fex/%70%69%63/item/c9fcc3cec3fdfc03ccabb38edd3f8794a4c22630.jpg\"\n    },\n    \"body\": \"这里是内容\",\n    \"actions\": [\n        {\n            \"type\": \"button\",\n            \"label\": \"编辑\",\n            \"actionType\": \"dialog\",\n            \"dialog\": {\n              \"title\": \"编辑\",\n              \"body\": \"你正在编辑该卡片\"\n            }\n        },\n        {\n          \"type\": \"button\",\n          \"label\": \"删除\",\n          \"actionType\": \"dialog\",\n          \"dialog\": {\n            \"title\": \"提示\",\n            \"body\": \"你删掉了该卡片\"\n          }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;card&quot;</code></td>\n<td>指定为 Card 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td><code>&quot;panel-default&quot;</code></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>header</td>\n<td><code>Object</code></td>\n<td></td>\n<td>Card 头部内容设置</td>\n</tr>\n<tr>\n<td>header.className</td>\n<td><code>string</code></td>\n<td></td>\n<td>头部类名</td>\n</tr>\n<tr>\n<td>header.title</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>header.subTitle</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>副标题</td>\n</tr>\n<tr>\n<td>header.desc</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>描述</td>\n</tr>\n<tr>\n<td>header.avatar</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>图片</td>\n</tr>\n<tr>\n<td>header.avatarText</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td></td>\n<td>如果不配置图片，则会在图片处显示该文本</td>\n</tr>\n<tr>\n<td>header.highlight</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否显示激活样式</td>\n</tr>\n<tr>\n<td>header.avatarClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;pull-left thumb avatar b-3x m-r&quot;</code></td>\n<td>图片类名</td>\n</tr>\n<tr>\n<td>body</td>\n<td><code>Array</code></td>\n<td></td>\n<td>内容容器，主要用来放置非表单项组件</td>\n</tr>\n<tr>\n<td>bodyClassName</td>\n<td><code>string</code></td>\n<td><code>&quot;padder m-t-sm m-b-sm&quot;</code></td>\n<td>内容区域类名</td>\n</tr>\n<tr>\n<td>actions</td>\n<td>Array&lt;<a href=\"./action\">Action</a>&gt;</td>\n<td></td>\n<td>配置按钮集合</td>\n</tr>\n</tbody></table>\n</div>",
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
