amis.define('docs/components/form/time.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Time 时间",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Time 时间",
    "icon": null,
    "order": 58,
    "html": "<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"time\",\n            \"name\": \"time\",\n            \"label\": \"时间\"\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F\" href=\"#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>显示格式</h2><p>选中任意时间，可以看到默认显示时间的格式是像<code>01:01</code>这样的格式，如果你想要自定义显示格式，那么可以配置<code>inputFormat</code>。</p>\n<p>例如你想显示<code>01时01分</code>这样的格式，查找 moment 文档可知配置格式应为 <code>HH时mm分</code>，即：</p>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"time\",\n            \"name\": \"time\",\n            \"label\": \"时间\",\n            \"inputFormat\": \"HH时mm分\"\n        }\n    ]\n}\n</script></div>\n<p>调整时间，观察显示格式</p>\n<h2><a class=\"anchor\" name=\"%E5%80%BC%E6%A0%BC%E5%BC%8F\" href=\"#%E5%80%BC%E6%A0%BC%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>值格式</h2><p>选中任意时间，可以看到默认表单项的值格式是像<code>1591862818</code>这样的时间戳格式。</p>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"time\",\n            \"name\": \"time\",\n            \"label\": \"时间\"\n        }\n    ]\n}\n</script></div>\n<p>如果你想要其他格式的日期值，，那么可以配置<code>format</code>参数用于调整表单项的值格式。</p>\n<p>例如你调整值为<code>01:11</code>这样的格式，查找 moment 文档可知配置格式应为 <code>HH:mm</code>，即：</p>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"time\",\n            \"name\": \"time\",\n            \"label\": \"时间\",\n            \"format\": \"HH:mm\"\n        }\n    ]\n}\n</script></div>\n<p>调整时间，观察数据域中表单项值的变化</p>\n<h2><a class=\"anchor\" name=\"%E9%BB%98%E8%AE%A4%E5%80%BC\" href=\"#%E9%BB%98%E8%AE%A4%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>默认值</h2><p>可以设置<code>value</code>属性，设置日期选择器的默认值</p>\n<h3><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE\" href=\"#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本配置</h3><p>配置符合当前 <a href=\"./date#%E5%80%BC%E6%A0%BC%E5%BC%8F\">值格式</a> 的默认值。</p>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"time\",\n            \"name\": \"time\",\n            \"label\": \"时间\",\n            \"value\": \"1591862818\"\n        }\n    ]\n}\n</script></div>\n<h3><a class=\"anchor\" name=\"%E7%9B%B8%E5%AF%B9%E5%80%BC\" href=\"#%E7%9B%B8%E5%AF%B9%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>相对值</h3><p><code>value</code> 还支持类似像<code>&quot;+1hours&quot;</code>这样的相对值，更加便捷的配置默认值</p>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"time\",\n            \"name\": \"time\",\n            \"label\": \"时间\",\n            \"value\": \"+1hours\"\n        }\n    ]\n}\n</script></div>\n<p>上例中配置了<code>&quot;value&quot;: &quot;+1hours&quot;</code>，默认就会选中一小时后。</p>\n<p>支持的相对值关键字有：</p>\n<ul>\n<li><code>now</code>: 当前时间</li>\n<li><code>hour</code>或<code>hours</code>: 时</li>\n<li><code>minute</code>或<code>minutes</code>: 分</li>\n<li><code>second</code>或<code>seconds</code>: 秒</li>\n</ul>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>value</td>\n<td><code>string</code></td>\n<td></td>\n<td><a href=\"./date#%E9%BB%98%E8%AE%A4%E5%80%BC\">默认值</a></td>\n</tr>\n<tr>\n<td>format</td>\n<td><code>string</code></td>\n<td><code>X</code></td>\n<td>时间选择器值格式，更多格式类型请参考 <a href=\"http://momentjs.com/\">moment</a></td>\n</tr>\n<tr>\n<td>inputFormat</td>\n<td><code>string</code></td>\n<td><code>HH:mm</code></td>\n<td>时间选择器显示格式，即时间戳格式，更多格式类型请参考 <a href=\"http://momentjs.com/\">moment</a></td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td><code>&quot;请选择时间&quot;</code></td>\n<td>占位文本</td>\n</tr>\n<tr>\n<td>clearable</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否可清除</td>\n</tr>\n<tr>\n<td>timeConstrainst</td>\n<td><code>object</code></td>\n<td><code>true</code></td>\n<td>请参考： <a href=\"https://github.com/YouCanBookMe/react-datetime\">react-datetime</a></td>\n</tr>\n</tbody>\n</table>\n",
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
          "label": "显示格式",
          "fragment": "%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F",
          "fullPath": "#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F",
          "level": 2
        },
        {
          "label": "值格式",
          "fragment": "%E5%80%BC%E6%A0%BC%E5%BC%8F",
          "fullPath": "#%E5%80%BC%E6%A0%BC%E5%BC%8F",
          "level": 2
        },
        {
          "label": "默认值",
          "fragment": "%E9%BB%98%E8%AE%A4%E5%80%BC",
          "fullPath": "#%E9%BB%98%E8%AE%A4%E5%80%BC",
          "level": 2,
          "children": [
            {
              "label": "基本配置",
              "fragment": "%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE",
              "fullPath": "#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE",
              "level": 3
            },
            {
              "label": "相对值",
              "fragment": "%E7%9B%B8%E5%AF%B9%E5%80%BC",
              "fullPath": "#%E7%9B%B8%E5%AF%B9%E5%80%BC",
              "level": 3
            }
          ]
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
