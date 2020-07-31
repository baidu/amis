amis.define('docs/components/form/switch.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Switch 开关",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Switch",
    "icon": null,
    "order": 51,
    "html": "<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"name\": \"switch\",\n            \"type\": \"switch\",\n            \"label\": \"开关\",\n            \"option\": \"开关说明\"\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E7%9C%9F%E5%81%87%E5%80%BC\" href=\"#%E9%85%8D%E7%BD%AE%E7%9C%9F%E5%81%87%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置真假值</h2><p>默认情况：</p>\n<ul>\n<li>开关打开时，表单项值为：true</li>\n<li>开关关闭时，表单项值为：false</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"controls\": [\n        {\n            \"name\": \"switch\",\n            \"type\": \"switch\",\n            \"label\": \"开关\"\n        }\n    ]\n}\n</script></div>\n<p>如果你想调整这个值，可以配置<code>trueValue</code>和<code>falseValue</code></p>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"controls\": [\n        {\n            \"name\": \"switch\",\n            \"type\": \"switch\",\n            \"label\": \"开关\",\n            \"trueValue\": 1,\n            \"falseValue\": 0\n        }\n    ]\n}\n</script></div>\n<p>调整开关，观察数据域变化，会发现打开后值为<code>1</code>，而关闭后为<code>0</code></p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>option</td>\n<td><code>string</code></td>\n<td></td>\n<td>选项说明</td>\n</tr>\n<tr>\n<td>trueValue</td>\n<td><code>any</code></td>\n<td><code>true</code></td>\n<td>标识真值</td>\n</tr>\n<tr>\n<td>falseValue</td>\n<td><code>any</code></td>\n<td><code>&quot;false&quot;</code></td>\n<td>标识假值</td>\n</tr>\n</tbody>\n</table>\n",
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
          "label": "配置真假值",
          "fragment": "%E9%85%8D%E7%BD%AE%E7%9C%9F%E5%81%87%E5%80%BC",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E7%9C%9F%E5%81%87%E5%80%BC",
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
